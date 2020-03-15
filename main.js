const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');
const child_process = require('child_process');
const R = require('r-script');

document.getElementById('file-input').addEventListener('change', e => handleFileChoice(e));

$('#loader').hide();
$("#alert-msg").hide();
$("#err-msg").hide();

async function handleFileChoice(event){
    let pathval = event.target.files[0].path;

    if(path.extname(pathval) != '.csv'){
        alert(`File has to be a .csv!`);
    }else{
        let headings = await getHeadings(pathval).catch(err => console.log(err));

        populateHeadingsList(headings, pathval);
        
    }

}

function runScript(){

    $('#run-button').hide();
    $('#loader').show();

    let output = document.querySelector('#script-output').value;
    var out = R('script.R').call((err, d) => {
        if(err){
            console.log(err);
            $("#err-msg").show();
            document.querySelector('#err-msg-output').textContent = err;
            
            $('#loader').hide();
        }else{
            console.log(d);

            let img = document.createElement('img');
            img.src = 'cdf.png';
            document.querySelector('#img-output').appendChild(img);
            
            $('#loader').hide();
        }
    });


    // child_process.exec('Rscript script.R', (err, stdout, stderr) => {
    //     if(err){
    //         console.log(err);
    //         $("#err-msg").show();
    //         document.querySelector('#err-msg-output').textContent = err;
    //     }

    //     if(stdout){
    //         console.log(stdout);
    //         let img = document.createElement('img');
    //         img.src = 'cdf.png';
    //         document.querySelector('#img-output').appendChild(img);
    //         // $("#alert-msg").show();
    //     }

    //     if(stderr){
    //         console.log(stderr);
    //     }

    //     $('#loader').hide();
    // });
}

function handleScript(heading, pathval){
    let output = `data <- read.csv("${pathval}")\n`;
    output += `png(file="cdf.png")\n`;
    output += `plot.ecdf(data\$${heading}, xlab="${heading}")\n`;
    output += `dev.off()`;

    document.querySelector('#script-output').value = '';
    document.querySelector('#script-output').value = output;

    fs.writeFile(path.join(__dirname, 'script.R'), output, err => {
        if(err){
            console.log(err);
        }
    });
}

function removeAllChildren(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

function toggleActive(element){
    if(element.className.toLowerCase().includes("list-group-item active ")){
        element.className = "list-group-item";
    }else{
        document.querySelectorAll('.list-group-item').forEach(item => {
            item.className = "list-group-item";
        });

        element.className += " active ";
    }
}

function populateHeadingsList(headings, pathval){
    let headingsList = document.querySelector('#headings-list');

    removeAllChildren(headingsList);

    headings.forEach(heading => {
        headingsList.appendChild(createHeading(heading, pathval));
    });

}

function createHeading(heading, pathval){
    let li = document.createElement('li');
    li.className = "list-group-item";
    li.textContent = heading;
    li.id = heading;

    li.addEventListener('click', e => {
        toggleActive(e.target);
        handleScript(heading, pathval);
    });

    return li;
}

function getHeadings(pathval){
    return new Promise((resolve, reject) => {
        fs.readFile(pathval, 'utf8', (err, data) => {
            if(err){
                reject(err);
            }else{
                parse(
                    data,
                    {
                        skip_empty_lines: true,
                        delimiter: ',',
                        trim: true,
                        skip_lines_with_error: true,
                        skip_lines_with_empty_values: true
                    },
                    (err, rows) => {
                        if(err){
                            reject(err);
                        }else{
                            resolve(rows[0].filter(a => a != ""));              // Returns array of all headings in csv file
                        }
                    }
                );
            }
        });
    });
}