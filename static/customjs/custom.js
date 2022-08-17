function addSkill(skill){
    console.log('went')
    id = $("#"+skill).attr('id');
    $("#"+skill).hide();
    $("#a"+skill).show();
    console.log('finished')
}
function removeSkill(skill){
    id = $("#"+skill).attr('id');
    $("#a"+skill).hide();
    $("#"+skill).show();
}