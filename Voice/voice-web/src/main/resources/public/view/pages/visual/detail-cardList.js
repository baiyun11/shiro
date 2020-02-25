$(function () {
    $('#hideORsearch').click(function () {
        if($('.input').css('display')=='none'){
            $('.input').show()
        }else {
            $('.input').hide()
        }
    });
    // $('#checkDash').bootstrapTable({
    //     columns:[
    //         {
    //             title:'仪表盘1',
    //             align:'center',
    //             halign:'center'
    //         },
    //         {
    //             title:'仪表盘2',
    //             align:'center',
    //             halign:'center'
    //         },
    //         {
    //             title:'仪表盘3',
    //             align:'center',
    //             halign:'center'
    //         }
    //     ]
    // });
    $('#table').bootstrapTable({
        columns:[
            {
                title:'column1',
                align:'center',
                halign:'center'
            },
            {
                title:'column2',
                align:'center',
                halign:'center'
            },
            {
                title:'column3',
                align:'center',
                halign:'center'
            }
        ]
    })
});