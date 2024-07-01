import React, { useState } from 'react';
import { useEffect } from 'react';
import { Card, Flex } from 'antd';
import { SoundOutlined, FileTextOutlined, FunctionOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;


const Landing = () => {
    const [data, setData] = useState([])
    const [error, setError] = useState()
    const navigate = useNavigate()
    const BASE_URL = 'http://127.0.0.1:5000'
    const ROUTE = ''
    useEffect(() => {
        fetchData();
    }, [])
    const CardClick = (value) => {
        console.log(value.assistant_id)
        if (value.assistant_id === 'Click here!') {
            navigate('/create')
        }
        //He want to comunicate with the assistant
        else{
            navigate(`/chat/${value.uuid}`)
        }
    }
    const ButtonClicked = (event, value, uuid) => {
        event.stopPropagation();
        console.log(`uuid= ${uuid}`)
        if (value === 'KB') {
            navigate(`/knowledgebase/${uuid}`)
        }
        else if (value === 'action') {
            navigate(`/action/${uuid}`)
        }
    }
    const fetchData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/${ROUTE}`);
            const jsonData = await response.json();
            setData(jsonData)

            setData(prevdata => ([
                ...prevdata,
                {
                    uuid: 'Add new',
                    assistant_id: 'Click here!',
                    assistant_name: 'Add New',
                    transcribe: 'no link',
                    synthesizer: '',
                    date: 'Click here to create new assistant!'
                }
            ]));

        }
        catch (error) {
            setError(error);
        }
    }
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', }}>
                {data.map((value, index) => (
                    <Card
                        hoverable
                        bordered={false}
                        style={{
                            width: 300,
                            margin: '20px',
                            border: '1px solid gray'
                        }}
                        onClick={() => { CardClick(value) }}
                    >
                        <Meta
                            title={value.assistant_name}
                            description={value.date}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <br />

                            <Button disabled={value.assistant_id === 'Click here!'}
                                block={value.assistant_id === 'Click here!'}
                                type="primary" icon={<FileTextOutlined />} style={{ margin: '5px' }} onClick={(event) => { ButtonClicked(event, 'KB', value.uuid) }}>
                                Add knowledge Base
                            </Button>
                            <Button
                                disabled={value.assistant_id === 'Click here!'}
                                block={value.assistant_id === 'Click here!'}
                                type="primary" icon={<FunctionOutlined />} style={{ margin: '5px' }} onClick={(event) => { ButtonClicked(event, 'action', value.uuid) }}>
                                Add Tools
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    )
};
export default Landing;