
const header: string = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>slideshow</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css" integrity="sha512-1PKOgIY59xJ8Co8+NE6FZ+LOAZKjy+KY8iq0G4B3CyeY6wYHN3yt9PW0XpSriVlkMXe40PTKnXrLnZ9+fkDaog==" crossorigin="anonymous" />        <style>

            html {
                height: 100vh
            }

            body,
            * {
                color: #333;
                background: #f8f8f8;
                font-size: 16px;
                font-family: 'Lato', sans-serif;
            }

            img {
                height: 280px;
            }

            .carousel, body {
                height: 100%
            }
            .data{
                background: #f8f8f8;
                padding: 5px 5px;
                padding-bottom: 35px;
            }
            
            .carousel-indicators .active{
                background-color: #0E72BA;
            }
            .carousel-indicators li{
                height: 8px !important;
                width: 8px !important;
                background-color: #888;
                border-radius: 50% !important;
            }
            .carousel-control-next, .carousel-control-prev {
                bottom: unset !important;
                top: 140px !important;
            }
        </style>
    </head>
    <body>
        <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">`;

const paginatorEnd: string = `
        </ol>
        <div class="carousel-inner">`;

const footer: string = `
            </div>
            <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                <i class="fas fa-2x fa-angle-left" aria-hidden="true"></i>
                <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                <i class="fas fa-2x fa-angle-right" aria-hidden="true"></i>
                <span class="sr-only">Next</span>
            </a>
        </div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>
    </body>

</html>`



export const getSlideshowTemplate = (data: Array<any>): string => {
    let body: string = ``;
    let paginator: string = ``;
    data.forEach((rs: any, index: number) => {
        paginator += `<li data-target="#carouselExampleIndicators" data-slide-to="${index}" class="${index === 0 ? 'active' : ''}"></li>`
    })
    data.forEach((rs: any, index: number) => {
        body += `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img class="w-100" src="${rs.main_image}"/>
                    <div class="w-100 d-block data">
                        ${rs.caption}
                    </div>
                </div>
            `
    })

    const template: string = header + paginator + paginatorEnd + body + footer;
    return template;
}