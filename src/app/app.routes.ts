import { Route } from "@angular/router";

export const appRoutes: Route[] = [{
    path: '',
    loadComponent: ()=>import("./table/table.component").then(res=>res.TableComponent)
}]