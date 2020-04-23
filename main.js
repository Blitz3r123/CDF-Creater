const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');
const R = require('r-script');
const { shell } = require('electron');

$('#loader').hide();
$('#complete-message').hide();

document.getElementById('file-input').addEventListener('change', e => handleFileChoice(e));

function handleFileChoice(event){
    
    fs.writeFileSync(path.join(__dirname, 'test.txt'), 'hello world');
    $('#file-input').hide();
    $('#loader').show();
    
    setTimeout(() => {
        let pathval = path.dirname(event.target.files[0].path) || dirname;
        
        // Search each folder for all files
        let files = getAllFiles(pathval, []);
        files = files.filter(a => path.extname(a) == '.csv');

        if(files.length == 0){
            addAlert(createAlert('danger', `Can't find any .csv files...`));
        }else{

            normaliseCSVs(files);

            files.forEach((file, fileindex) => {
                addAlert(createAlert('secondary', 'Reading ' + file));

                if(!fs.existsSync(file)){
                    addAlert(createAlert('danger', `The path ${file} doesn't exist.`));
                    console.log(`%c ${file} doesn't exist.`, 'color: red;');
                }else{
                
                    let contents = fs.readFileSync(file, 'utf8');       // Change files[0] to all files 
                                                                        // when its working
                
                    let rows = contents.split('\n');

                    let headings = rows[0].split(',');

                    let targetHeading, targetHeadingIndex;

                    headings.forEach((item, index) => {
                        if( item.toLowerCase().includes('latency') ){
                            targetHeading = item;
                            targetHeadingIndex = index;
                        }
                    });
                    
                    if( ! (targetHeading == null || targetHeadingIndex == null) ){
                        addAlert(createAlert('primary', 'Creating script.R'));
                        handleScript(targetHeading, file);
                        
                        addAlert(createAlert('info', 'Executing script.R'));
                        var out = R('script.R').callSync()
                        let oldPath, newPath;
                        
                        oldPath = path.join(__dirname, path.basename(file).replace('.csv', '') + '.png');
                        newPath = path.join( path.dirname(file), path.basename(oldPath) );
                        
                        addAlert(createAlert('success', `Created ${path.basename(oldPath)}`));

                        addAlert(createAlert('info', `Copying from \n\n ${oldPath} \n\n to \n\n ${newPath}`));
                        fs.copyFileSync(oldPath, newPath);
                                
                        // console.log(`${path.basename(oldPath)} moved from \n ${path.dirname(oldPath)}\n to \n ${path.dirname(newPath)}`);
                            
                        addAlert(createAlert('info', `Deleting \n\n ${oldPath}`));
                        fs.unlinkSync(oldPath);
                                
                    }

                    addAlert(createAlert('success', 'Finished processing ' + file));
                }
            });

        }

        
        $('#loader').hide();
        // $('#complete-message').show();
        $('#file-input').show();
        
        if(reloadOnFinishValue){
            location.reload();
        }
        
        if(showFileOnFinishValue){
            shell.showItemInFolder(files[0]);
        }


    }, 500);
    
}

function addAlert(alert){
    let container = document.querySelector('#alert-container');
    container.appendChild(alert);
    container.scrollTop = container.scrollHeight - container.clientHeight;
    
}

function normaliseCSVs(files){
    files.forEach((file, index) => {
        
        let rawData = fs.readFileSync(file, 'utf8');
        let rows = rawData.split('\n');
        let header = rows[0].split(',');
        let headerLength = rows[0].split(',').length;

        let newHeader = [];
        header.forEach(item => {
            newHeader.push(item.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s/g,''));
        });

        /*
            1. Count how many items in header
            2. Go through each row and see if same amount of items as header
            3. If not delete that row
            4. After going through everything, rewrite the csv
        */

        let output = [];

        rows.forEach((row, index) => {
            let rowLength = row.split(',').length;
            
            if(index == 0){
                output.push(newHeader);
            }else{
                let toDel = false;
                
                // Check if the row has any empty values
                row.split(',').forEach(item => {
                    if(item == ''){
                        toDel = true;
                    }
                });
                
                if(rowLength == headerLength && !toDel){
                    output.push(row);
                }
            }
        });

        output = output.join('\n\n');

        // await writeToFile(file, output);
        fs.writeFileSync(file, output, 'utf8');
    });
}

function createAlert(color, message){
    let div = document.createElement('div');
    div.className = 'alert alert-' + color;
    div.role = 'alert';
    div.textContent = message;

    return div;
}

function getAllFiles(dirPath, arrayOfFiles){
    // https://coderrocketfuel.com/article/recursively-list-all-the-files-in-a-directory-using-node-js

    files = fs.readdirSync(dirPath);
 
    arrayOfFiles = arrayOfFiles || [];
    
    files.forEach(file => {
        if(fs.lstatSync( path.join(dirPath, file) ).isDirectory()){
            arrayOfFiles = getAllFiles( path.join(dirPath, file), arrayOfFiles );
        }else{
            arrayOfFiles.push( path.join(dirPath, file) );
        }
    });

    return arrayOfFiles;
}

function handleScript(heading, pathval){
    let output = `data <- read.csv("${pathval}")\n`;
    output += `png(file="${path.basename(pathval).replace('.csv', '')}.png")\n`;
    output += `plot.ecdf(data\$${heading}, xlab="${heading} Latency")\n`;
    output += `dev.off()`;

    fs.writeFileSync(path.join(__dirname, 'script.R'), output);
}