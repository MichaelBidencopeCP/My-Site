function addSkill(skill){
            
    id = skill.slice(5);
    $("#"+skill).hide();
    $("#a"+skill).show();
    var list = $("#skills").val();
    if(list == ""){
        $("#skills").val(id);
    }
    else{
        $("#skills").val(list+","+id);
    }
    console.log($("#skills").val());
    
}
function removeSkill(skill){
    id = skill.slice(5);
    $("#a"+skill).hide();
    $("#"+skill).show();
    var list = $("#skills").val();
    list = list.split(",");
    var index = list.indexOf(id);
    if (index > -1) {
        list.splice(index, 1);
    }
    $("#skills").val(list.join(","));

    console.log($("#skills").val());
}
function tabs(tab){
    if(tab == 0){
        $('.tabz').removeClass('active') 
        $('#projectAddTab').addClass('active');
        $('.tabCards').hide();
        $('#projectAdd').show();
    }
    else if(tab == 1){
        $('.tabz').removeClass('active') 
        $('#addSkillTab').addClass('active');
        $('.tabCards').hide();
        $('#addSkill').show();
    }
}
async function getSkills(){
    const response = await fetch('/api/skills');
    const data = await response.json();
    
    //for in data
    for(var i = 0; i < data['json_list'].length; i++){
        
        //append to unselected skills and selected Skills
        $('#unselected-skills').append('<span id="skill'+data['json_list'][i]['id']+'" class = "toskills" onclick="addSkill(\'skill'+data['json_list'][i]['id']+'\')"><img src="'+data['json_list'][i]['link']+'"></span>');
        $('#selected-skills').append('<span id="askill'+data['json_list'][i]['id']+'" style="display:none" class = "toskills m1" onclick="removeSkill(\'skill'+data['json_list'][i]['id']+'\')"><img src="'+data['json_list'][i]['link']+'"></span>');
    }
    return true;
}