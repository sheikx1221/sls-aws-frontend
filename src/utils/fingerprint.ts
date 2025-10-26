import { ClientJS } from 'clientjs';

const fingerprint = new ClientJS().getFingerprint();
console.log("Device fingerprint = ",fingerprint);

export default fingerprint;