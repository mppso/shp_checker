window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
  
    loader.classList.add("loader--hidden");
  
    loader.addEventListener("transitionend", () => {
      document.body.removeChild(loader);
    });
  });
$(document).ready(function () {
    $.getJSON( "ea_list.json", function( json ) {
        //Change mt_province in line 13 if you wish to change the name of the municipality
        let municipality = json.mt_province[0].municipality;
        var dataset = [], data = [];
        for(var m=0; m < municipality.length; m++){
            for(var x=0; x < municipality[m].barangays.length; x++){
                var name = municipality[m].barangays[x].name,
                    fund = municipality[m].barangays[x].fund, code;
                    if(fund == "PSA") fund = '<span class="text-success">'+fund+'</span>';
                    else fund = '<span class="text-primary">'+fund+'</span>';
                for(var y=0; y < municipality[m].barangays[x].ea.length; y++){
                    code = municipality[m].barangays[x].code+municipality[m].barangays[x].ea[y];
                    data.push(name,code,fund);
                    $.ajax({
                        type: "GET",
                        url: "https://cbms.psa.gov.ph/api/check_shapefiles/CAPI/HPQ"+code,
                        async: false,
                        success: function(result) {
                            if(result == "False") data.push('<span class="badge text-bg-danger">Not Uploaded</span>');
                            else data.push('<span class="badge text-bg-success">Uploaded</span>');
                        }
                    });
                    dataset.push(data);
                    data = [];
                }
            }
            $('table#'+municipality[m].name).DataTable({
                responsive: true,
                columns: [
                    { title: 'Barangay'},
                    { title: 'Geocode'},
                    { title: 'Funding Agency'},
                    { title: 'Shapefile Status'}
                ],
                data: dataset
            });
            data = [], dataset = [];
        }
    });
});