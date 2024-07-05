import React from 'react';
import { Button, Form, Input, Select, Title, Upload } from 'antd';
import { ApiFetch } from './ApiFetchc';
import { useNavigate } from 'react-router-dom';

const onFinish = (values) => {
    console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};
const { TextArea } = Input;
const chatmodel = [
    {
        'openai/gpt-4': 'TpYYoF10'
    },
    {
        'openai/gpt-3.5-turbo': 'TpLuZxTI'
    }, {
        'openai/gpt-4o': 'TpEGEtek'
    }
]


const CreateAssistant = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const route = 'assistant'
            const data = await ApiFetch({ values, route });
            console.log('Success:', data);
            navigate('/');
        } catch (error) {
            console.error('Error:', error);
            alert('Error:', error)
        }
    };

    const onFinishFailed = (errorInfo) => {

        console.log('Failed:', errorInfo);
    };
    return (
        <>
            <div style={styles.container}>
                <div style={styles.formWrapper}>
                    <h2 style={styles.title}>Create Assistant</h2>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}

                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        style={styles.form}
                    >
                        <Form.Item
                            label="Assistant Name"
                            name="assistant"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input Assistant name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label="System prompt" name="prompt"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input system prompt for your assistant',
                                },
                            ]}>
                            <TextArea rows={7} />
                        </Form.Item>

                        <Form.Item label="Description" name='description'
                            rules={[
                                {
                                    required: true,
                                }
                            ]}>
                            <TextArea rows={4}/>
                        </Form.Item>

                        <Form.Item label="model" name="model"
                            rules={[
                                {
                                    required: true,
                                }
                            ]}
                        >
                            <Select>
                                {chatmodel.map((model, index) => {
                                    const modelName = Object.keys(model)[0];
                                    const modelId = model[modelName];
                                    return (
                                        <Select.Option key={index} value={modelId}>
                                            {modelName}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit" style={styles.button}>
                                Create
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#ded5e6',
    },
    formWrapper: {
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        width: '600px',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        height:'80vh',
        flexDirection: 'column',
        
    },
    button: {
        width: '100%',
    },
};
export default CreateAssistant;