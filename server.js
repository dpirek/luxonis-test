import http from 'http';
import sql from './db.js'

const PORT = process.env.PORT ? process.env.PORT : 8080;

async function select() {
  return await sql`SELECT * FROM estates`;
}

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function Page({ estates, page }) {
  const perPage = 9;
  const spliced = estates.slice((page - 1) * perPage, page * perPage);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Houses For Sale</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    </head>
    <body>
      <main>

        <section class="py-5 text-center container">
          <div class="row py-lg-1">
            <div class="col-lg-6 col-md-8 mx-auto">
              <h1 class="fw-light">Houses</h1>
              <p class="lead text-body-secondary">There are ${estates.length} houses listed.</p>
            </div>
          </div>
        </section>
    
        <div class="album py-5 bg-body-tertiary">
          <div class="container">
      
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              ${spliced.map(estate => {
                return `
                <div class="col">
                  <div class="card shadow-sm">
                    <img width="100%" height="225" src="${estate?.image}" />
                    <div class="card-body">
                      <p class="card-text">${estate.name} ${estate?.locality}</p>
                      <div class="d-flex justify-content-between align-items-center">
                        <small class="text-body-secondary">${formatPrice(estate.price)} Kč</small>
                      </div>
                    </div>
                  </div>
                </div><!-- item -->`
              }).join('')}
            </div>
            
            <hr />

            <nav>
              <ul class="pagination">
                ${page > 1 ? `<li class="page-item"><a class="page-link" href="/?page=${page - 1}">Previous</a></li>` : ''}
                <li class="page-item"><a class="page-link" href="/?page=${page + 1}">Next</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </main>
  
      <footer class="text-body-secondary py-5">
        <div class="container">
          <p class="mb-1">Houses For Sale</p>
        </div>
      </footer>
    </body>
    </html>`;
}

const server = http.createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(200, { 'Content-Type': 'image/x-icon' });
    return res.end('');
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const page = Number(url.searchParams.get('page')) || 1;
 
  select().then(estates => {
    console.log(estates[0], estates.length);
    res.end(Page({ estates: estates, page: page }));
  });

  
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});