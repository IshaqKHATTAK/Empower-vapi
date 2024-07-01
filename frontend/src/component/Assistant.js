import { TinyColor } from '@ctrl/tinycolor';
import { Button, ConfigProvider, Space } from 'antd';
import CreateAssistant from './CreateAssistant';

const colors1 = ['#6253E1', '#04BEFE'];
const getHoverColors = (colors) =>
    colors.map((color) => new TinyColor(color).lighten(5).toString());
const getActiveColors = (colors) =>
    colors.map((color) => new TinyColor(color).darken(5).toString());
const btnstyle = { display: 'flex', height: '120px', width: '150px', }
const divstyle = { height: '100vh', display: 'flex', justifyContent: 'center', alignContent: 'center' }
const Assistant = () => (
    <>
        <div style={divstyle}>
            <Space>
                <ConfigProvider
                    theme={{
                        components: {
                            Button: {
                                colorPrimary: `linear-gradient(135deg, ${colors1.join(', ')})`,
                                colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors1).join(', ')})`,
                                colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(colors1).join(', ')})`,
                                lineWidth: 0,
                            },
                        },
                    }}
                >
                    <Button type="primary" style={btnstyle} >
                       <h4>Create Assistant </h4>
                    </Button>
                </ConfigProvider>
            </Space>
        
        </div>
    </>
);
export default Assistant;