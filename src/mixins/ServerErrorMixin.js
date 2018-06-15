import {ServerError} from "../errors";

export default {
    methods: {
        parseErrorObject(error, list = null)
        {
            if (error instanceof ServerError) {
                const r = error.response;
                switch (r.statusCode) {
                    case 401:
                        return {
                            text: 'You are not logged in',
                            key: null, // TODO
                        };
                    case 403:
                        return {
                            text: 'Permission denied',
                            key: null, // TODO
                        };
                    case 404:
                        return {
                            text: 'Entity no longer exists',
                            key: null, // TODO
                        };
                    case 422:
                        return r.json()
                            .then(json => json.errors ? json.errors[0] : null)
                            .then(error => {
                                // TODO: get key from list
                                return {
                                    text: "Invalid data",
                                    key: null
                                };
                            });

                    case 500:
                        return r.json()
                            .then(json => json.error)
                            .then(error => {
                                return {
                                    text: 'Internal Server Error: {{message}}',
                                    key: null, // TODO: add a key,
                                    params: {
                                        message: error || 'Unexpected Error',
                                    }
                                };
                            });
                }
            }

            return null;
        }
    }
};