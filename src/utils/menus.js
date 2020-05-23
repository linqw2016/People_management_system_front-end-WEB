import {getRequest} from "@/utils/api";

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }
    getRequest("/system/config/menu").then(data => {
        if (data) {
            let fmtRoutes = formatRoutes(data);
            router.addRoutes(fmtRoutes);
            store.commit('initRoutes', fmtRoutes);//向initRoutes方法中提交fmtRoutes参数；
            store.dispatch('connect');
            // console.log(fmtRoutes);
        }
    });
};

export const formatRoutes = (froutes) => {
    let fmtRoutes = [];
    froutes.forEach(router => {
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children
        } = router;

        if (children && children instanceof Array) {
            children = formatRoutes(children);
        }
        let fmtRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            meta: meta,
            children: children,
            component(resolve) {//component(resolve)为异步组建；

                if (component.startsWith("Home")) {
                    require(["../views/" + component + ".vue"], resolve);
                } else if (component.startsWith("Emp")) {
                    require(["../views/emp/" + component + ".vue"], resolve);
                } else if (component.startsWith("Per")) {
                    require(["../views/per/" + component + ".vue"], resolve);
                } else if (component.startsWith("Sal")) {
                    require(["../views/sal/" + component + ".vue"], resolve);
                } else if (component.startsWith("Sta")) {
                    require(["../views/sta/" + component + ".vue"], resolve);
                } else if (component.startsWith("Sys")) {
                    require(["../views/sys/" + component + ".vue"], resolve);
                }
            }
        };
        fmtRoutes.push(fmtRouter);
    });
    return fmtRoutes;
};
