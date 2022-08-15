import LivroDAO from "../DAO/LivrosDAO.js"
import bd from "../data/sqlite.js"
import LivrosModel from "../model/LivrosModel.js"
import validacaoLivro from "../middleware/validacaoLivros.js"
export const Livros = app => {

    //READ 
    app.get('/livros/', (req, res) => {
        LivroDAO.listarLivros(bd)
            .then((success) => {
                res.status(200).json(success)
            }).catch((error) => {
                res.status(400).json(error)
            })

    })

    app.get('/livros/:id', async (req, res) => {
        const id_livro = req.params.id
        try {
            const livro = await LivroDAO.listarLivrosPorId(bd, id_livro)

            if (!livro) {
                res.status(400).json({
                    message: "Livro não encontrado"
                })
            }

            res.status(200).json(livro)
        } catch (erro) {
            res.status(400).json(erro)
        }

    })

    //CREATE 
    app.post('/livros', validacaoLivro, async (req, res) => {
        const { titulo, descricao, categoria, url_img, preco, total_paginas, ano_publicacao, autor } = req.body
        const livro = new LivrosModel(titulo, descricao, categoria, url_img, preco, total_paginas, ano_publicacao, autor)
        const message = {
            success: 'Livro cadastrado com sucesso',
            error: false
        }
        try {
            await LivroDAO.adicionarLivros(bd, livro)
            res.status(201).json(message.success)
        } catch (erro) {
            res.status(400).json({ error: erro.message })
        }
    })
    //UPDATE 
    app.patch('/livros/:id', async (req, res) => {
        const id_livro = req.params.id
        const { titulo, descricao, categoria, url_img, preco, total_paginas, ano_publicacao, autor } = req.body
        const livroAtualizado = new LivrosModel(titulo, descricao, categoria, url_img, preco, total_paginas, ano_publicacao, autor)
        const message = {
            success: 'O livro especificado não foi encontrado.',
            error: false
        }
        const messageAtt = {
            success: 'Livro atualizado com sucesso.',
            error: false
        }
        const livroExiste = await LivroDAO.listarLivrosPorId(bd, id_livro);
        if (!livroExiste) {
            return res
                .status(404)
                .json(message.success);
        }
        try {
            await LivroDAO.atualizarLivro(bd, id_livro, livroAtualizado); // parametros chamados
            res.status(200).json(messageAtt.success);
        } catch (erro) {
            res.status(400).json({ error: erro.message });
        }
    });


    //DELETE
    app.delete('/livros/:id', async (req, res) => {
        const id_livro = req.params.id;
        const livroExiste = await LivroDAO.listarLivrosPorId(bd, id_livro)
        const message = {
            success: "O livro especificado não encontrado",
            error: false,
        }

        if (!livroExiste) {
            return res.status(404).json(message.success)
        }
        try {
            await LivroDAO.deletarLivro(bd, id_livro)
            res.status(200).json({ message: "Livro deletado com sucesso" })
        } catch (erro) {
            res.status(400).json({ error: erro.message });
        }
    })
}
