import './styling/App.css';
import HomePageComponent from "./components/HomePageComponent";
import {Component} from "react";

class App extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            hasError: false
        }
    }

    static getDerivedStateFromError(error) {
        console.log(error);
        return {hasError: true};
    }

    render() {
        const {hasError} = this.state;

        if (hasError) {
            return (<h1>Whoops! Something went wrong. Please close the window and try again.</h1>);
        } else {
            return (<HomePageComponent/>);
        }
    }
}

export default App;
