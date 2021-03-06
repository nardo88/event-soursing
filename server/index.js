import express from 'express'
import cors from 'cors'
import events from 'events'

const PORT = 5000
// create example express
const app = express()
// use cors politics
app.use(cors())
// use JSON
app.use(express.json())
// создаем event imittior для управления событиями
const emitter = new events.EventEmitter() 

// create first endpint for get request
app.get('/connect', (req, res) => {
    // создаем заголовки
    res.writeHead(200, {
        // заголовок держать подключение
        'Connection': 'keep-alive',
        // второй указываем что тип контента будет текст а соединение event stream
        'Content-Type': 'text/event-stream',
        // третий указывает что мы ничего не кешируем
        'Cache-Control': 'no-cach'
    })
    // подписываемся на событие. on - будет срабатывать неограниченное 
    // количество раз
    emitter.on('newMessage', (message) => {
        res.write(`data: ${JSON.stringify(message)} \n\n`)
    })
})

// add new message
app.post('/new-messages', ((req, res) => {
    // получаем сообщение из тела запроса
    const message = req.body;
    // создаем событие и передаем в него сообщение
    emitter.emit('newMessage', message)
    // возращаем статус 200
    res.json({
        status: 200
    })
}))

// start our server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))


