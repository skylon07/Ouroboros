import AppApi from 'shared/AppApi'

export default class ConsoleApi extends AppApi {
    constructor() {
        super('/console')
    }

    async fetchMessages() {
        const response = await this._callGetAction('/messages')
        return response.messages
    }
}
