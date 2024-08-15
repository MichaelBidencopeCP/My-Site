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
class Projects{
    constructor(){
        
    }
    // fills projects from call to /api/projects
    async fill(){
        let response = await fetch("/api/projects");
        let data = await response.json();
        
        let count = 0;
        for (let i = 0; i < data['json_list'].length; i++) {
            
            let skills = data['json_list'][i]['id'];
            

            const element = data['json_list'][i];
            let row = ''
            let frow = ''
            let check = this.priorityCol(element['priority'])
            if (count == 0){
                frow = ''
            }
            count += check;
            if (count >= 12){
                count = 0;
                row = ''
                count = 0;
            }
            let prio = 'col-12 col-lg-' + check;

            


            $('#projects').append(frow + '<div class="'+ prio +' mt-2" ><div class="card" style="height:100%"><div class="card-body"><h2> ' + element['project_name'] + '  </h2><p>  ' + element['discription'] + ' </p><div class="btn-group">' + this.check_git(element) + this.check_live(element) + '</div><div class="row mt-2" ><div class="col">'+ await this.addSkills2P(skills) + '</div></div></div></div>'+row);
            row = ""
        }

    }
    async addSkills2P(skills){
        //request skills/id from api
        let response = await fetch("/api/skills/"+skills);
        let data = await response.json();
        
        //for in data['json_list']
        let skillslist = "";
        for(let i = 0; i < data['json_list'].length; i++){
            //check if i % 5 = 0
            if(i % 5 == 0){
                //if so add a new row
                skillslist += '</div></div><div class="row"><div class="col">';
            }
            skillslist += '<img class="mt-2" src="' + data['json_list'][i] + '">';
        }
        return skillslist;
        
    }
    priorityCol(prio){
        if (prio == 3){
            return 12;                    
        }
        else if (prio == 2){
            return 6;
        }
        else if (prio == 1){
            return 4;                    
        }
        else{
            return 12;                    
        }
    }
    check_git( element){
        if (element['github'] != null){
            return '<a class="btn btn-info" href="' + element['github'] + '">Github</a>'
        }
        return ""

    }
    check_live(element){
        if (element['live'] != null){
            return '<a href="' + element['live'] + '" class="btn btn-info" >Live</a>'
        }
        return ""
    }
}