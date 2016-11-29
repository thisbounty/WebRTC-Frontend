var TableDatatablesResponsive = function () {

    var initTable1 = function () {
        var table = $('#call_table');

        var oTable = table.dataTable({
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No entries found",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",
                "lengthMenu": "_MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            // setup buttons extentension: http://datatables.net/extensions/buttons/
            buttons: [],

            // setup responsive extension: http://datatables.net/extensions/responsive/
            responsive: {
                details: {

                }
            },


            "info": false,
            "searching": false,
            "paging": true,
            "lengthChange": false,

            "order": [
                [0, 'asc']
            ],

            "lengthMenu": [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": 10,

            "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
            "ajax":{
                'url':App.api_url(config.calls_get_all_url),
                'dataSrc': function ( json ) {
                    table=[];
                    for ( var i=0, ien=json.calls.length ; i<ien ; i++ ) {
                        call=json.calls[i];
                        switch (call.status) {
                            case "Connected":
                                if(call.searcher) {
                                    //if current logged user is related to call
                                    if(call.searcher.id == localStorage.getItem('userId')) {
                                        table.push([call.created, call.caller, '<button class="disconnect btn red btn-block" call-id="'+call.id+'" data-session="'+call.session+'" data-token="'+call.token+'">Connected</button>']);
                                    }
                                    else {
                                        table.push([call.created, call.caller, call.status]);
                                    }
                                }
                                break;

                            case "Incoming":
                                table.push([call.created, call.caller, '<button class="connect btn green btn-block" name="connect" call-id="'+call.id+'" data-session="'+call.session+'" data-token="'+call.token+'">'+call.status+"</button>"]);
                                break;

                            default:
                                table.push([call.created, call.caller, call.status]);

                        }
                    }
                    return table;
                }
            },
            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });
    };

    return {

        //main function to initiate the module
        init: function () {

            if (!jQuery().dataTable) {
                return;
            }

            initTable1();
        }

    };

}();

$(window).load(function() {
    TableDatatablesResponsive.init();
});

var urlToChangeStream = config.sse_url;
var src = new EventSource(urlToChangeStream);
src.addEventListener('data', function(msg) {
    var table_api = $('#call_table').DataTable();
    var data = JSON.parse(msg.data);
    if (data.type) {
        switch (data.type) {
            case "update":
                if(data.data.searcher)
                {
                    //if current logged user is related to call
                    if(data.data.searcher.id == localStorage.getItem('userId')) {
                        var button = $('div.portlet-body button[call-id="' + data.data.id + '"]');
                        button.text("Connected");
                        button.removeClass("green");
                        button.addClass("red");
                        button.removeClass("connect");
                        button.addClass("diconnect");
                    }
                    else {
                        $('div.portlet-body button[call-id="' + data.data.id + '"]').replaceWith(data.data.status);
                    }
                }
                else {
                    $('div.portlet-body button[call-id="' + data.data.id + '"]').replaceWith(data.data.status);
                }
                break;

            case "create":
                table_api.row.add([data.data.created, data.data.caller.firstName, '<button class="connect btn green btn-block" name="connect" call-id="'+data.data.id+'" data-session="'+data.data.session+'" data-token="'+data.data.token+'">'+data.data.status+"</button>"]).draw(false);
                break;

            default:
                console.log(data);
        }
    }
});
