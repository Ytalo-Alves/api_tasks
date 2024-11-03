import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './middlewares/routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

// cria o servidor http.
const server = http.createServer(async (req, res) => {

  // extrai o método http da requisição.
  const { method, url } = req

  // chama o middleware para processar o corpo da requisição como JSON.
  await json(req, res)

  // Encontra uma rota que corresponde ao método HTTP e ao caminho da URL da requisição.
  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  // verifica se a rota correspondente foi encontrada
  if(route) {

    // extrai os parâmetros da requisição
    const routeParams = req.url.match(route.path)

    // Desestrutura os parâmetros de consulta.
    const { query, ...params } = routeParams.groups

    // Define os parâmetros da rota na requisição.
    req.params = params

    // extrai e define os parâmetros de consulta na requisição.
    req.query = query ? extractQueryParams(query) : {}

    //chama o manipulador da rota (handler) para processar a requisição e retornar a resposta.
    return route.handler(req, res)
  }
  console.log(route)
})

server.listen(3333)