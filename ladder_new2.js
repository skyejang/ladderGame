var heightNode = 0;
var widthNode =  0;

var LADDER = {};
var row =0;
var ladder = $('#ladder');
var ladder_canvas = $('#ladder_canvas');
var GLOBAL_FOOT_PRINT= {};
var GLOBAL_CHECK_FOOT_PRINT= {};
let contents = [];
var working = false;
const canvas = document.getElementById('ladder_canvas');
const ctx = canvas.getContext('2d');

const ladder_function = function(){
    
    $('input[name=member]').on('focusout',function(){
        var member = $('input[name=member]').val();
        if(member < 2){
            return alert('최소 2개 이상 설정 가능합니다.')
        }else if(member > 5){
            return alert('최대 5개까지 설정 가능합니다')
        }else if(member){
            $('.input-value-wrap').empty();
            for(let i = 0; i < member; i++){
                $('.input-value-wrap').append('<div class="inputBox"><span>하단 멘트'+(i+1)+'</span><input type="text" name="below_text"data-node="'+i+'"/> autocomplete="off"')
            }
        }
    });

    function init(){
        canvasDraw();
    }
    
    $('#next-button').on('click', function(){
        var member = $('input[name=member]').val();
        if(member < 2){
            return alert('최소 2개 이상 설정 가능합니다.')
        }
        if(member > 5){
            return alert('최대 5개까지 설정 가능합니다'); 
        }

        $('.group').css({display : 'none'});
        $('.destination-wrap').css({display : 'block'});
        
        var member = $('input[name=member]').val();
        for(let i = 0; i < member; i++){
            $('.input-value-wrap').append('<div class="inputBox"><span>결과 문구'+(i+1)+'</span><input type="text" name="below_text" tabindex="'+(i+1)+'" data-node="'+i+'" autocomplete="off" maxlength="5"/>')
        }
        is_set = false;
        
    });

    //수연 수정
    $('#plus').on('click',function(){
        var member = Number($('input[name=member]').val());
        if(member >= 5){
            return alert('최대 5개까지 설정 가능합니다'); 
        }
        member+=1;
        $('input[name=member]').val(member);
    });
    //수연 수정
    $('#minus').on('click',function(){
        var member = Number($('input[name=member]').val());
        if(member <= 2){
            return alert('최소 2개 이상 설정 가능합니다.')
        }

        member-=1;
        $('input[name=member]').val(member);
    })

    $('#start_btn').on('click',function(){
        drawNodeLine();
    });

    function canvasDraw(){
        ladder.css({
            'width' :( widthNode-1) * 362 + 9, 
            'height' : (heightNode-1) * 90 + 9,
        });
       ladder_canvas
       .attr('width' , ( widthNode-1) * 362 + 9)
       .attr('height' , ( heightNode-1) * 90 + 9);

        setDefaultFootPrint();
        reSetCheckFootPrint();
        setDefaultRowLine();
        setRandomNodeData();
        drawDefaultLine();
        userSetting();
        resultSetting();
        
    }
    var userName = "";
    var start_index = "";
    $(document).on('click', 'button.ladder-start', function(e){
        if(working){
            return false;
        }
        $('.dim').remove();
        working = true;
        reSetCheckFootPrint();
        var _this = $(e.target);
        _this.attr('disabled' ,  true).css({
            'opacity' : '0.6',
        })
        var node = _this.attr('data-node');
        var color =  _this.attr('data-color');
        var _index = node.split('-')[0]*1;
        start_index = node.split('-')[0]*1;
        let _numbers = document.querySelectorAll('.user-wrap').length;
        document.querySelectorAll('.images-class')[_index].style.display = 'block';
        startLineDrawing(node, color, _index);
        userName =  $('input[data-node="'+node+'"]').val();

        _index === _numbers-1 ? document.querySelectorAll('.ladder-start')[0].classList.add('charactherFocus') :
        document.querySelectorAll('.ladder-start')[_index+1].classList.add('charactherFocus');
    })

    let arrResult = []; 
    function startLineDrawing(node , color, _index){

        var node = node;
        var color = color;
        var x = node.split('-')[0]*1;
        var y = node.split('-')[1]*1;
        var nodeInfo = GLOBAL_FOOT_PRINT[node];
        GLOBAL_CHECK_FOOT_PRINT[node] = true;
        var dir = 'r'
        if(y ==heightNode ){ 
            reSetCheckFootPrint();
            var target = $('input[data-node="'+node+'"]');
            target.css({
                'border' : "12px solid "+color+""
            })
            $('#' + node + "-user").text(userName)
            arrResult.push({'user': userName, 'value': target.attr('value'), 'index':(Number(start_index)+1)});
            let result_index = arrResult[arrResult.length-1];
            if(arrResult.length > 0){
                document.querySelectorAll('.images-class')[result_index.index-1].style.display = 'none';
            }
             working = false;
            return false;
        }
        if(nodeInfo["change"] ){
            var leftNode = (x-1) + "-" +y;
            var rightNode = (x+1) + "-" +y;
            var downNode = x +"-"+ (y + 1);
            var leftNodeInfo = GLOBAL_FOOT_PRINT[leftNode];
            var rightNodeInfo = GLOBAL_FOOT_PRINT[rightNode];
            
            if(GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){  
                var leftNodeInfo = GLOBAL_FOOT_PRINT[leftNode];
                var rightNodeInfo = GLOBAL_FOOT_PRINT[rightNode];
                if(  (leftNodeInfo["change"] &&  leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (rightNodeInfo["change"])&&  leftNodeInfo["draw"]  && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    stokeLine(x, y, 'w' , 'l' , color ,18)
                    animateCircle(x, y, 'w' , 'l', _index)
                    setTimeout(function(){ 
                        return startLineDrawing(leftNode, color,_index)
                    }, 400);
                }
                else if(  (leftNodeInfo["change"] &&  !!!leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (rightNodeInfo["change"]) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    stokeLine(x, y, 'w' , 'r' , color ,18)
                    animateCircle(x, y, 'w' , 'r', _index)
                    setTimeout(function(){ 
                        return startLineDrawing(rightNode, color,_index)
                     }, 400);
                }
                else if(  (leftNodeInfo["change"] &&  leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (!!!rightNodeInfo["change"]) ){
                    stokeLine(x, y, 'w' , 'l' , color ,18)
                    animateCircle(x, y, 'w' , 'l', _index)
                     setTimeout(function(){ 
                         return startLineDrawing(leftNode, color, _index)
                     }, 400);
                }
                 else if(  !!!leftNodeInfo["change"]  &&  (rightNodeInfo["change"]) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    stokeLine(x, y, 'w' , 'r' , color ,18)
                    animateCircle(x, y, 'w' , 'r', _index)
                     setTimeout(function(){ 
                         return startLineDrawing(rightNode, color, _index)
                     }, 400);
                }
                else{
                    stokeLine(x, y, 'h' , 'd' , color ,18)
                    animateCircle(x, y, 'h' , 'd', _index)
                    setTimeout(function(){ 
                       return startLineDrawing(downNode, color, _index)
                    }, 400);
                }
            
            
            }else{ 
               if(!!!GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){      
                    if(  (rightNodeInfo["change"] && !!!rightNodeInfo["draw"] ) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                        stokeLine(x, y, 'w' , 'r' , color ,18)
                        animateCircle(x, y, 'w' , 'r', _index)
                        setTimeout(function(){ 
                            return startLineDrawing(rightNode, color, _index)
                        }, 400);
                    }else{
                        stokeLine(x, y, 'h' , 'd' , color ,18)
                        animateCircle(x, y, 'h' , 'd', _index)
                        setTimeout(function(){ 
                           return startLineDrawing(downNode, color, _index)
                        }, 400);
                    }
                    
               }else if(GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && !!!GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){   
                    if(  (leftNodeInfo["change"] && leftNodeInfo["draw"] ) && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ){
                        stokeLine(x, y, 'w' , 'l' , color ,18)
                        animateCircle(x, y, 'w' , 'l', _index)
                        setTimeout(function(){ 
                            return startLineDrawing(leftNode, color, _index)
                        }, 400);
                    }else{
                        stokeLine(x, y, 'h' , 'd' , color ,18)
                        animateCircle(x, y, 'h' , 'd', _index)
                        setTimeout(function(){ 
                           return startLineDrawing(downNode, color, _index)
                        }, 400);
                    }
               }
            }


        }else{
            var downNode = x +"-"+ (y + 1);
            stokeLine(x, y, 'h' , 'd' , color ,18)
            animateCircle(x, y, 'h' , 'd', _index)
            setTimeout(function(){ 
                return startLineDrawing(downNode, color, _index)
             }, 400);
        }
    }



    function userSetting(){
        var userList = LADDER[0];
        var html = '';
        var color = ['#ff8205', '#3765b3', '#dc1920', '#2CA321', '#f4da00'];
        for(var i=0; i <  userList.length; i++){
            var x = userList[i].split('-')[0]*1;
            var y = userList[i].split('-')[1]*1;
            var left = x * 360 - 75 
            html += '<div class="user-wrap" style="left:'+left+'"><input type="text" data-node="'+userList[i]+'" value="'+(i+1)+'번" style="border:none" readonly><button class="ladder-start" data-index="'+i+'"data-color="'+color[i]+'" data-node="'+userList[i]+'"><img src="./img/horse'+(i+1)+'.png" style="width:150px;"></button>';
            html +='</div>'
        }
        ladder.append(html);
    }   
    function resultSetting(){
         var resultList = LADDER[heightNode-1];

        var html = '';
        let below_text = document.querySelectorAll('input[name=below_text]');
        for(var i=0; i <  resultList.length; i++){
            var x = resultList[i].split('-')[0]*1;
            var y = resultList[i].split('-')[1]*1 + 1;
            var node = x + "-" + y;
            var left = x * 360 - 150;
            html += '<div class="answer-wrap" style="left:'+left+'"><input type="text" data-node="'+node+'" value="'+contents[i]+'" readonly>';
            html +='</div>'
        }
        ladder.append(html);
    }

    function drawNodeLine(){
        tab_count++;
        for(var y =1; y < heightNode-1; y++){
            for(var x = 0; x <widthNode ; x++){
                var node = x + '-' + y;
                var nodeInfo  = GLOBAL_FOOT_PRINT[node];
                if(nodeInfo["change"] && nodeInfo["draw"] ){
                    
                     stokeLine(x, y ,'w' , 'r' , '#575757' , '16')
                }else{
                }
            }
        }
    }

   

    let checkMember = function(){
        var moveToStart =0, moveToEnd =0, lineToStart =0 ,lineToEnd =0; 
        var member = document.querySelectorAll('.user-wrap').length;
        var eachWidth;
        var eachHeight = 88;
        if(member === 2){
            eachWidth = 355;
        }
        if(member === 3){
            eachWidth = 358;
        }
        if(member === 4){
            eachWidth = 359;
        }
        if(member === 5){
            eachWidth = 360;
        }  
        return [eachWidth, eachHeight];
    }

    function stokeLine(x, y, flag , dir , color , width){
        let _val = checkMember();
        let eachWidth = _val[0];
        let eachHeight = _val[1];
        if(flag == "w"){
            if(dir == "r"){
                ctx.beginPath();
                moveToStart = x * eachWidth ;
                moveToEnd = y * eachHeight ;
                lineToStart = (x+ 1) * eachWidth;
                lineToEnd = y * eachHeight;
                
            }else{
                 ctx.beginPath();
                moveToStart = x * eachWidth;
                moveToEnd = y * eachHeight;
                lineToStart = (x- 1) * eachWidth;
                lineToEnd = y * eachHeight;
            }
        }else{
                ctx.beginPath();
                moveToStart = x * eachWidth ;
                moveToEnd = y * eachHeight;
                lineToStart = x * eachWidth ;
                lineToEnd = (y+1) * eachHeight;
        }

        ctx.moveTo(moveToStart + 9 ,moveToEnd  + 9);
        ctx.lineTo(lineToStart  + 9 ,lineToEnd  + 9);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.closePath();
    }

    function animateImage(x,y, _index){
        document.querySelectorAll('.images-class')[_index].style.left = x;
        document.querySelectorAll('.images-class')[_index].style.top = y;
        document.querySelectorAll('.images-class')[_index].classList.add('animate');
        
    }
    
    function animateCircle(x, y, flag , dir, _index){
        let _val = checkMember();
        let eachWidth = _val[0];
        let eachHeight = _val[1];
        const _position = {
            x: x * eachWidth,
            y: y * eachHeight,
        };
        
        if(flag == "w"){
            if(dir == "r"){
                for(let i = 0; i <= 360; i++){
                    setTimeout(function(){
                        animateImage((_position.x-68) + i , _position.y - 75, _index);
                    },150)
                }
            }else{
                    for(let i = 0; i >= -360; i--){
                        setTimeout(function(){
                            animateImage((_position.x-68) + i, _position.y - 75, _index);
                        },150)
                    }
            } 
        }else{
            for(let i = 0; i <= 88; i++){
                setTimeout(function(){
                    animateImage(_position.x -68, (_position.y- 75)+i, _index);
                },150)
            }
        } 
        
    }

   

    function drawDefaultLine(){
        var html = '';
        html += '<table>'
         for(var y = 0; y < heightNode-1; y++){
             html += '<tr>';
             for(var x =0; x <widthNode-1 ; x++){
                html += '<td style="width:358px; height:88px; border-left:16px solid #575757; border-right:16px solid #575757;"></td>'; // 기존값 : 248px, 09.29 수정
            }
            html += '</tr>';
        }
        html += '</table>'
        ladder.append(html);
    }

    function setRandomNodeData(){
         for(var y =1; y < heightNode-1; y++){
             for(var x =0; x <widthNode ; x++){
                 var loopNode = x + "-" + y;
                 var rand = Math.floor(Math.random() * 2);
                 if(rand == 0){
                    GLOBAL_FOOT_PRINT[loopNode] = {"change" : false , "draw" : false};
                }else{
                    if(x == (widthNode - 1)){
                        GLOBAL_FOOT_PRINT[loopNode] = {"change" : false , "draw" : false};
                    }else{
                        GLOBAL_FOOT_PRINT[loopNode] =  {"change" : true , "draw" : true};
                        x = x + 1;
                        loopNode = x + "-" + y;
                        GLOBAL_FOOT_PRINT[loopNode] =  {"change" : true , "draw" : false};
                    }
                }
            }
        }

        if(checkFootPrint() === true){
            setRandomNodeData();
        }
    }
    function checkFootPrint(){
        let has_no_horizon;
        let count_horizon = 0;
        for (var x = 0; x < widthNode - 1; x++) {
            for(var y =1; y < heightNode-1; y++) {
                var loopNode = x + "-" + y;
                if(GLOBAL_FOOT_PRINT[loopNode].draw === true) {
                    count_horizon++;
                }
            }
            if(count_horizon === 0){
                return has_no_horizon = true;
            }else{
                count_horizon = 0;
            }
        }
        return has_no_horizon = false;
    }

    

    function setDefaultFootPrint(){
        for(var r = 0; r < heightNode; r++){
            for(var column =0; column < widthNode; column++){
                GLOBAL_FOOT_PRINT[column + "-" + r] = false;
            }
        }
    }
    function reSetCheckFootPrint(){
        for(var r = 0; r < heightNode; r++){
            for(var column =0; column < widthNode; column++){
                GLOBAL_CHECK_FOOT_PRINT[column + "-" + r] = false;
            }
        }
    }

    function setDefaultRowLine(){

        for(var y =0; y < heightNode+1; y++){
            var rowArr = [];
            for(var x =0; x <widthNode ; x++){
                var node = x + "-"+ row;
                rowArr .push(node);
                var left = x * 362;
                var top = row * 88;
                var node = $('<div></div>')
                .attr('class' ,'node')
                .attr('id' , node)
                .attr('data-left' , left)
                .attr('data-top' , top)
                .css({
                    'position' : 'absolute',
                    'left' : left,
                    'top' : top
                });
                ladder.append(node);
             }
             LADDER[row] =  rowArr;
             row++;
        }
    }
    let space_count = 0;
    let tab_count = 0;
    let r_count = 0;
    let is_set = true;
    
    window.addEventListener("load",function(){
        let _click = 0;

        this.document.body.addEventListener('keydown',function(){
            if(document.querySelectorAll('.ladder-start').length > 0){
                if(event.keyCode === 13 && _click === 0){ //enter
                    _click = 1;
                    document.querySelectorAll('.ladder-start')[0].classList.add('charactherFocus');
                }else if(event.keyCode === 39 && _click > 0){
                   getFocusIndex('right');
                }else if(event.keyCode === 37 && _click > 0){
                    getFocusIndex('left');
                }else if(event.keyCode === 32 && _click > 0){//space바
                    if(document.querySelectorAll('.answer-wrap').length > space_count && arrResult.length === space_count){
                        getFocusIndex('go')
                    }
                }else if(event.keyCode === 16){
                    is_set = false;
                    if(tab_count === 0){
                        drawNodeLine();
                    }
                }else if(event.keyCode === 82){
                    if(r_count === 0){
                        arrResult.length === 1 ? singlePopup() : resultPopup();
                    }
                }
    
            }else{
                if(event.keyCode === 13 && is_set){ 
                    $('.group').css({display : 'none'});
                    $('.destination-wrap').css({display : 'block'});
                    
                    var member = $('input[name=member]').val();
                    for(let i = 0; i < member; i++){
                        $('.input-value-wrap').append('<div class="inputBox"><span>결과 문구'+(i+1)+'</span><input type="text" name="below_text" tabindex="'+(i+1)+'" data-node="'+i+'" maxlength="5"/>')
                    }
                    is_set = false;
                }
                
                if(event.keyCode === 39){
                    is_set ? $('#plus').click() : showLadder();
                }
                
                if(event.keyCode === 37){
                    is_set ? $('#minus').click() : location.reload();
                }
            }
        })
    })

    function showLadder(){
        var member = $('input[name=member]').val();
        widthNode = Number(member);
        heightNode = 8;
        $('#landing').css({
            'opacity': 0
        });
        $('input[name=below_text]').each(function(index, item){
            contents.push($(item).val());
        })
        setTimeout(function(){
            $('#landing').remove();
            init();
        }, 310)
    }
    
    $('#nextStep').click(function(){
        showLadder();
    });

    $('#prevStep').click(function(){
       location.reload();
    })

    function getFocusIndex(dir){
        let _index;
        let _numbers = document.querySelectorAll('.user-wrap').length;
        document.querySelectorAll('.ladder-start').forEach(function(ele){
            if(ele.classList.contains('charactherFocus')){
                _index = Number(ele.dataset.index);
                document.querySelectorAll('.ladder-start')[_index].classList.remove('charactherFocus');
            }
        })  
        if(dir === 'left'){
            
            if(_index === 0){

                document.querySelectorAll('.ladder-start')[_numbers-1].classList.add('charactherFocus');
            }else{
                document.querySelectorAll('.ladder-start')[_index-1].classList.add('charactherFocus');
            }
        }else if(dir === 'right'){
            _index === _numbers-1 ? document.querySelectorAll('.ladder-start')[0].classList.add('charactherFocus') :
            document.querySelectorAll('.ladder-start')[_index+1].classList.add('charactherFocus');
        }else{
            if(!document.querySelectorAll('.ladder-start')[_index].disabled){
                document.querySelectorAll('.ladder-start')[_index].click(); 
                space_count++;
            }else{
                _index === _numbers-1 ? document.querySelectorAll('.ladder-start')[0].classList.add('charactherFocus') :
                document.querySelectorAll('.ladder-start')[_index+1].classList.add('charactherFocus');
            }
        }
    }

    function resultPopup(){
        arrResult = arrResult.sort((a,b) => a.user.toLowerCase() < b.user.toLowerCase() ? -1 : 1);
        let userLength = document.querySelectorAll('.ladder-start').length;
        r_count++;
            let content = '';
            let ani = '';
            let lists = '';
            ani += '<div id="result-img" class="result-img"></div>'
            content += '<div class=result-title><p style="display:flex; align-items:center;"><span style="width:84px; display:block; margin-right:10px;"><img src="./img/confetti_ball_3d.png" style="width:100%;"></span>사다리게임 결과<span style="width:84px; display:block; margin-left:10px;"><img src="./img/confetti_ball_3d.png" style="width:100%"></span></p></div>'
            content += '<div id="resultList-wrap"></div>'
            for(let i=0;i<arrResult.length;i++){
                lists += 
                `<div class="result-content">
                    <div style="margin-right:100px; display:flex; align-items:center; min-width:240px;">
                        <img src="./img/horse`+(arrResult[i].index)+`.png" style="width:100px; margin-right:30px;"/>
                        <span>`+arrResult[i].user+` 말</span>
                    </div>
                    <span>`+arrResult[i].value+`</span>
                </div>`
            }
            $('#result-outter').append(ani);
            $('#result').append(content);
            $('#resultList-wrap').append(lists);
            setTimeout(function(){
                $('#result-outter').css('display', 'block');
            }, 600);
    } 

    function singlePopup(){
        let content = '';
            let ani = '';
            r_count++;
            ani += '<div id="result-img" class="result-img"></div>'
            if(arrResult[arrResult.length-1].value === "꽝"){
                content += '<div class=result-title><p style="display:flex; align-items:center;"><span style="width:84px; display:block; margin-right:10px;"><img src="./img/face_with_tears_of_joy_3d.png" style="width:100%"></span>사다리게임 결과<span style="width:84px; display:block; margin-left:10px;"><img src="./img/face_with_tears_of_joy_3d.png" style="width:100%"></span></p></div>'
                content += 
                    `<div class="result-content single">
                        <span class="value_text" style="font-size:450px;"><img src="./img/bomb_3d.png" style="width:20%">`+arrResult[arrResult.length-1].value+`<img src="./img/bomb_3d.png" style="width:20%"></span>
                    </div>`
            }else{
                content += '<div class=result-title><p style="display:flex; align-items:center;"><span style="width:84px; display:block; margin-right:10px;"><img src="./img/confetti_ball_3d.png" style="width:100%"></span>사다리게임 결과<span style="width:84px; display:block; margin-left:10px;"><img src="./img/confetti_ball_3d.png" style="width:100%"></span></p></div>'
                content += 
                `<div class="result-content single">
                    <span class="value_text">`+arrResult[arrResult.length-1].value+`</span>
                </div>`
            }
            
            $('#result-outter').append(ani);
            $('#result').append(content);
            setTimeout(function(){
                $('#result-outter').css('display', 'block');
            }, 600);
    }

    function maxLengthCheck(object) {
        if (object.value.length > object.max.length)    
        object.value = object.value.slice(0, object.max.length)
    }
};
ladder_function();







