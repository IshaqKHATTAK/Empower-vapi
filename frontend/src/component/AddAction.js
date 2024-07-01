import React from 'react';
import { Button, Form, Input, Select, Title, Upload } from 'antd';
import { ApiFetch } from './ApiFetchc';
import { useNavigate, } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const { TextArea } = Input;
const AddAction = () => {
    const navigate = useNavigate();
    const {uuid} = useParams()
    
    const onFinish = async (values) => {
        try {
            
            const route = `action/${uuid}`
            const data = await ApiFetch({values, route});
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
           <h2 style={styles.title}>Add Action</h2>
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
                   label="Action title"
                   name="title"
                   rules={[
                       {
                           required: true,
                           message: 'Please input action name!',
                       },
                   ]}
               >
                   <Input />
               </Form.Item>

               <Form.Item label="title description" name="title_desc"
                   rules={[
                       {
                           required: true,
                           message: 'Please input title description',
                       },
                   ]}>
                   <TextArea rows={7} />
               </Form.Item>

               <Form.Item
                   label="Route"
                   name="route"
                   rules={[
                       {
                           required: true,
                           message: 'Please input action route!',
                       },
                   ]}
               >
                   <Input />
               </Form.Item>

               <Form.Item
                   label="Route Summary"
                   name="route_summary"
                   rules={[
                       {
                           required: true,
                           message: 'Please input action route summary!',
                       },
                   ]}
               >
                   <Input />
               </Form.Item>

               <Form.Item
                   label="Route Description"
                   name="route_desc"
                   rules={[
                       {
                           required: true,
                           message: 'Please input action route description!',
                       },
                   ]}
               >
                   <Input />
               </Form.Item>
               

               <Form.Item
                   label="server url"
                   name="server_url"
                   rules={[
                       {
                           required: true,
                           message: 'Please input server URL!',
                       },
                   ]}
               >
                   <Input />
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
  )
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
export default AddAction;
