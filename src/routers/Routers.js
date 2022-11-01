import React, { Component } from 'react'
import { BrowserRouter, Route } from "react-router-dom"
import { routers } from "./router"

export default class Routers extends Component {
    render() {
        return (
            <BrowserRouter>
            {
                routers.map((routes, index) => (
                    <Route exact key={index} path={routes.path} component={routes.components} />
                ))
            }


        </BrowserRouter>
        )
    }
}
