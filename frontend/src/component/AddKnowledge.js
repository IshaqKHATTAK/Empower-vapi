import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload, Input, Form, InputNumber, TextArea } from 'antd';
import { useState } from 'react';
import { Overlay } from 'antd/es/popconfirm/PurePanel';
import { useParams } from 'react-router-dom';
const BASE_URL = 'http://127.0.0.1:5000'
const route = 'addknowledge'

const AddKnowledge = () => {
    const [title, setTitle] = useState('');
    const [chsize, setChsize] = useState();
    const [choverlap, setChOverlap] = useState();
    const [CollName, setCollName] = useState('')
    const [collDescrip, setCollDescrip] = useState('')

    const {uuid} = useParams()

    const props = {
        name: 'file',
        action: `${BASE_URL}/${route}/${uuid}`,
        headers: {
            authorization: 'authorization-text',
        },
        data: {
            title: title,
            collection_name: CollName,
            collection_description: collDescrip,
            chunkSize: chsize,
            chunkOverlap: choverlap,

        },

        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };
    const handleChunkOverlap = (value) => {
        setChOverlap(value)
    }
    const handleTitleChange = (e) => {
        setTitle(e.target.value)
    }
    const handleChunkChange = (value) => {
        setChsize(value)
    }
    const handleCollNameChange = (e) => {
        setCollName(e.target.value)
    }
    const handleCollDescriptChange = (e) => {
        setCollDescrip(e.target.value)
    }
    const { TextArea } = Input;
    return (

        <>
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
            <h2 style={{textAlign: 'center',marginBottom: '20px',}}>Add knowledge to the assistant</h2>
                <Form style={{width:'40%'}}>

                    <Form.Item>
                        <Input placeholder="Collection name" value={CollName} name='collection_name' onChange={handleCollNameChange} style={{ marginRight: '10px', width: '100%' }} />
                    </Form.Item>

                    <Form.Item  name="collection_description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input system prompt for your assistant',
                                },
                            ]}>
                        <TextArea rows={5} placeholder="Collection Description" value={collDescrip} onChange={handleCollDescriptChange}/> 
                    </Form.Item>

                    <Form.Item>
                        <Input placeholder="Enter title" value={title} name='title' onChange={handleTitleChange} style={{ marginRight: '10px', width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        rules={[{ required: true, message: 'Please chucnk size!' }]}
                    >
                        <InputNumber defaultValue={chsize} placeholder='Enter chuck size' style={{ width: '100%' }} onChange={handleChunkChange} />
                    </Form.Item>

                    <Form.Item
                        rules={[{ required: true, message: 'Please chucnk overlap!' }]}
                    >
                        <InputNumber defaultValue={Overlay} placeholder='Enter chuck overlap' style={{ width: '100%' }} onChange={handleChunkOverlap} />
                    </Form.Item>

                    <Form.Item>
                        <Upload {...props} accept=".txt,.md,.pdf, .html, .docs">
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}
export default AddKnowledge;
