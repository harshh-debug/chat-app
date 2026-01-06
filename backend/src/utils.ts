export function getCode(){
    const str ="AbZhH218Pqhqw652sgwbzghjaosijhbvc"
    let code=""
    for(let i=0;i<8;i++){
        let idx= Math.floor(Math.random()*str.length)
        code+=str[idx];
    } 
    return code;
}