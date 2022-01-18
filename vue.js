var store = {
    save(key,value){
        window.localStorage.setItem(key,JSON.stringify(value));
    },
    fetch(key){
        return JSON.parse(window.localStorage.getItem(key))||[];
    }
}

var list = store.fetch("storeData");

var vm = new Vue({
    el:".main",
    data:{
        list,
        todo:'',
        edtorTodos:'',
        beforeTitle:"",
        visibility:"all"
    },
    watch:{

        list:{
            handler:function(){
                store.save("storeData",this.list);
            },
            deep:true
        }

    },
    methods:{
        enterFn(ev){

            if(this.todo==""){return;}
            this.list.push({
                title:this.todo,
                isComplete:false
            });
            this.todo = "";
        },
        delFn(item){
            var index = this.list.indexOf(item);
            this.list.splice(index,1)
        },
        edtorTodo(item){

            this.beforeTitle = item.title;
            this.edtorTodos = item;
        },
        edtoEnd(item){
            this.edtorTodos="";

        },
        cancelEdit(item){
            item.title = this.beforeTitle;
            this.beforeTitle = '';
            this.edtorTodos='';
        }
    },
    directives:{
        "focus":{
            update(el,binding){
                if(binding.value){
                    el.focus();
                }
            }
        }
    },
    computed:{
        unComplete(){
            return  this.list.filter(item=>{
                return !item.isComplete
            }).length
        },
        filterData(){

            var filter = {
                all:function(list){
                    return list;
                },
                completed:function(list){
                    return list.filter(item=>{
                        return item.isComplete;
                    })
                },
                unCompleted:function(list){
                    return list.filter(item=>{
                        return !item.isComplete;
                    })
                }
            }

            return filter[this.visibility]?filter[this.visibility](list):list;
        }

    }
});
function hashFn(){
    var hash = window.location.hash.slice(1);
    vm.visibility = hash;
}
hashFn();
window.addEventListener('hashchange',hashFn);
