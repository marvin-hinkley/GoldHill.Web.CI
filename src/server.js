const path = require('path')
const config = require('config')
const express = require('express')
const Shell = require('node-powershell')

const port = 3333
const app = express()
const ps = new Shell({
	executionPolicy: 'Bypass',
	noProfile: true,
})

app.use('/deploy', (req, res) => {
	try {
		console.log('Executing Gatsby CI')
		res.send('Executing Gatsby CI')

		ps.on('output', (data) => console.log(data))
		ps.on('err', (err) => console.error(err))
		ps.on('end', (code) => console.log(`powershell exited with code ${code}`))

		ps.addCommand(`cd ${config.get('gatsby_path')}`)
		ps.addCommand(`yarn build`)
		ps.addCommand(`yarn deploy`)
		ps.invoke()
			.then((response) => console.log(response))
			.catch((err) => console.error(err))
	} catch (error) {
		console.log(`Could not build gatsby: ${error}`)
	}
})

app.listen(port, () => console.log(`Gatsby CI listening on ${port}`))
