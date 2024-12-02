import React, { useState, useEffect } from 'react';

function Notes() {

    //Используем useEffect для отображения заметок при загрузке компонента
    useEffect(() => {
        AllNotes()
    }, []);

    const handleSubmit = async evt => {
        evt.preventDefault();  //отменяем перезагрузку страницы при нажатии кнопки в форме

        //при клике по кнопке "отправить" отправляем данные на сервер
        const response = await fetch('http://localhost:7070/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ content: form.newNote }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Ошибка:', errorData);
            return;
        }
        
        //Очищаем поле формы
        setForm({ newNote: '' })
        //Обновляеам список записей на странице
        AllNotes();
    }

    //Функция для получения списка заметок
    const AllNotes = async () => {
        const response = await fetch('http://localhost:7070/notes');
        const notesFromServer = await response.json();
        console.log(notesFromServer);
        setNotes(notesFromServer);  //Записываем полученные данные из сервера в состояние записей
    }

    //Состояние для формы
    const [form, setForm] = useState({
        newNote: ''
    })

    //Состояние для списка записей
    const [notes, setNotes] = useState([]);

    //Функция для добавлния вводимых символов в состояние поля формы
    const handleNewNote = ({ target }) => {
        setForm({ ...form, newNote: target.value });
    }

    //Функция удаления записей
    const deleteNotes = async (id) => {
        const responses = await fetch(`http://localhost:7070/notes/${id}`,
            { method: 'DELETE' });
        AllNotes();  //обновляем список записей
    }

    //Функция обнолвения записей для клика по кнопке "обновить"
    const update = () => {
        AllNotes();
    }

    return (
        <div>
            <div className='header'>
                <h1>Notes</h1>
                <button className='update' onClick={update}>🗘</button>
            </div>

            <div className='allnotes'>
                {notes.map((item) => (
                    <div key={item.id}>
                        {item.content}
                        <button className='button-delete' onClick={() => deleteNotes(item.id)}>x</button>
                    </div>
                ))}
            </div>

            <span>New Note</span>
            <form onSubmit={handleSubmit} >
                <input type='text' name='newNote' id='NnewNote' value={form.newNote} onChange={handleNewNote} />
                <button>▶</button>
            </form>
        </div>
    )
}

export default Notes; 