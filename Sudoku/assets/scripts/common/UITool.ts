//广度优先搜索，先监测一度关系，再检查二度关系
export const searchNode = function(parent:cc.Node,name:string):cc.Node{

    let search = (node:cc.Node,name:string)=>{
        let queue = [node];

        for(let i = 0; i < queue.length; ++i){
            if(queue[i].name == name){
                return queue[i];
            }
            queue = queue.concat(queue[i].children);
        }
    }
    return search(parent,name);
}

export const searchComp = function<T extends cc.Component>(parent:cc.Node,name:string,com:any):T{
    let node = searchNode(parent,name);
    if(!node){
        return null;
    }
    return node.getComponent<T>(com);
}