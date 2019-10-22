export default [
    {
        title: "诊疗记录与统计",
        link: "/sys/regionalAnalysis",
        key: "regionalAnalysis",
        icon: "idcard"
    },
    {
        title: "数据采集模块",
        key: "yonghuxingwei",
        icon: "contacts",
        children: [
            {
                title: "采集模块流程",
                link: "/sys/pathAnalysis",
                key: "pathAnalysis",
                icon: "link"
            },
            {
                title: "ADHD数据采集",
                link: "/sys/view/p1",
                key: "p1",
                icon: "line-chart"
            },
        ]
    },
    {
        title: "智能辅助诊断",
        // link: "/sys/users",
        key: "users",
        icon: "user"
    },

    {
        title: '模型训练',
        key: 'echarts',
        icon: 'icon-visual',
        children: [
            {
                // link: '/sys/echarts/bar',
                key: 'Bar',
                icon: 'bar-chart',
                title: '模型切换与参数配置',
            },
            {
                // link: '/sys/echarts/line',
                key: 'line',
                icon: 'line-chart',
                title: '模型重新练',
            },
        ]
    },
    //         {
    //             link: '/sys/echarts/area',
    //             key: 'area',
    //             icon: 'area-chart',
    //             title: 'Area'
    //         },
    //         {
    //             link: '/sys/echarts/yBar',
    //             key: 'yBar',
    //             icon: 'icon-yBar',
    //             title: 'YBar'
    //         },
    //         {
    //             link: '/sys/echarts/funnel',
    //             key: 'funnel',
    //             icon: 'icon-funnel',
    //             title: 'Funnel'
    //         },
    //         {
    //             link: '/sys/echarts/pie',
    //             icon: 'pie-chart',
    //             key: "pie",
    //             title: 'Pie'
    //         },
    //         {
    //             link: '/sys/echarts/pieDoughnut',
    //             key: 'pieDoughnut',
    //             icon: 'icon-pieDoughnut',
    //             title: 'PieDoughnut'
    //         },
    //         {
    //             link: '/sys/echarts/sankey',
    //             key: 'sankey',
    //             icon: 'icon-sankey',
    //             title: 'Sankey'
    //         },
    //     ]
    // },
    
    
];