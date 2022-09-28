import { EntrarNaBrincadeiraReply } from "./proto/EntrarNaBrincadeiraReply";

export function isEntraraNaBrincadeiraReply(value: any): value is EntrarNaBrincadeiraReply {
    return value !== undefined 
    && typeof value['success'] === 'boolean'
    && (typeof value['authtoken'] === 'string' || typeof value['authtoken'] === 'undefined')
    && (typeof value['message'] === 'string' || typeof value['message'] === 'undefined')
}