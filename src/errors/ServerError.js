import ExtendableError from "./ExtendableError";

export default class ServerError extends ExtendableError {
    /**
     * Response
     * @param response
     */
    constructor(response){
        super(response.statusText);
        this._response = response;
    }

    get response(){
        return this._response;
    }
}

