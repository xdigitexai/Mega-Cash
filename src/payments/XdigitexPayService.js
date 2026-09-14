export class XdigitexPayService {
  constructor({ apiKey, baseUrl, fetchImpl = fetch }) { this.apiKey=apiKey; this.baseUrl=baseUrl; this.fetch=fetchImpl; }
  async request(path, options={}) {
    if(!this.apiKey) throw new Error('Xdigitex Pay is not configured');
    const response=await this.fetch(`${this.baseUrl}${path}`,{...options,headers:{'Content-Type':'application/json','X-API-Key':this.apiKey,...options.headers}});
    const body=await response.json().catch(()=>({}));
    if(!response.ok||body.success===false) throw new Error(body.message||`Xdigitex Pay request failed (${response.status})`);
    return body;
  }
  initiateDeposit({amount,phone,description,callbackUrl,webhookUrl}) { return this.request('/payments/initiate',{method:'POST',body:JSON.stringify({amount,currency:'UGX',gateway:'mobile',phone,description,callback_url:callbackUrl,webhook_url:webhookUrl})}); }
  paymentStatus(reference) { return this.request(`/payments/${encodeURIComponent(reference)}/status`); }
  createWithdrawal({amount,phone}) { return this.request('/withdrawals',{method:'POST',body:JSON.stringify({amount,currency:'UGX',method:'mobile_money',account_number:phone})}); }
}
