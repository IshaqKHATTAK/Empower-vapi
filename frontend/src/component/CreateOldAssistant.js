import React from 'react';
import { Button, Form, Input, Select, Title, Upload } from 'antd';
import { ApiFetch } from './ApiFetchc';
import { useNavigate } from 'react-router-dom';
///Error in sedning data to the backend ------------------------------------

const onFinish = (values) => {
    console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};
const { TextArea } = Input;
const chatmodel = [
    {
        'openai/gpt-4': 'TpB5TLsq'
    },
    {
        'anthropic/claude-3-sonnet': 'TpTP46IM',
    },
    {
        'openai/gpt-3.5-turbo': 'TpKZuZ81'
    }, {
        'openai/gpt-4o': 'TpFKdsaM'
    }
]
const transcribers = [
    {
        'openai/whisper-1': 'whisper'
    },
    {
        'DeepGram/nova-2': 'nova2'
    },
]
const synthesizer = [
    {
        'Google/gtts': 'gtts'
    },
]

const CreateAssistant = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const formData = new FormData();
        formData.append('assistant', values.assistant);
        formData.append('prompt', values.prompt);
        formData.append('model', values.model);
        formData.append('transcriber', values.transcriber);
        formData.append('synthesizer', values.synthesizer);
        if (values.up_file && values.up_file.file) {
            formData.append('file', values.up_file.file.originFileObj);
        }

        try {
            const data = await ApiFetch(formData);
            console.log('Success:', data);
            navigate('/chat');
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

                        <Form.Item label="model" name="model">
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

                        <Form.Item label="Upload File" name="up_file">
                            <input type="file" />
                        </Form.Item>

                        <Form.Item label="transcriber" name="transcriber">
                            <Select>
                                {transcribers.map((model, index) => {
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

                        <Form.Item label="synthesizer" name="synthesizer">
                            <Select>
                                {synthesizer.map((mdl, index) => {
                                    const modelName = Object.keys(mdl)[0];
                                    const modelId = mdl[modelName]
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
                                Submit
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
        backgroundColor: '#f0f2f5',
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
        flexDirection: 'column',
    },
    button: {
        width: '100%',
    },
};
export default CreateAssistant;