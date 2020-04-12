let reloadOnFinishValue = false, showFileOnFinishValue = false;

function handleSettings(){
    let reloadOnFinish = document.querySelector('#reloadOnFinish');

    reloadOnFinish.checked ? reloadOnFinishValue = true : reloadOnFinishValue = false;

    let showFileOnFinish = document.querySelector('#showFileOnFinish');

    showFileOnFinish.checked ? showFileOnFinishValue = true : showFileOnFinishValue = false;

    

}
