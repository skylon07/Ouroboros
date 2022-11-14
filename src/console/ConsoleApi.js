import PageApi from 'shared/PageApi'

export default class ConsoleApi extends PageApi {
    constructor() {
        super('/console')
    }

    async fetchMessages() {
        const response = await this._callGetAction('/messages')
        return response.messages
    }
}
