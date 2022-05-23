import React, { PureComponent } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Row,
  Col,
  Divider,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import ErrorMessage from '../../../components/ErrorMessage';

class MeetForm extends PureComponent {
  formRef = React.createRef();

  handleOk = () => {
    const { onOk, formObject } = this.props;

    this.formRef.current
      .validateFields()
      .then((values) => {
        const data = {
          id: formObject.id,
          name: values.name,
          scheduledTime: values.scheduledTime && values.scheduledTime.toJSON(),
          participantEmails: values.participants.map(({ email }) => email),
        };
        onOk(data);
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  modalTitle = () => {
    const { formType } = this.props;

    switch (formType) {
      case 'create':
        return 'Create Meet';
      case 'update':
        return 'Update Meet';
      default:
        return 'Meet';
    }
  };

  render() {
    const {
      visible,
      confirmLoading,
      maskClosable,
      destroyOnClose,
      formErrors,
      formObject,
    } = this.props;
    const title = this.modalTitle();

    return (
      <div className='meet-form-container'>
        <Modal
          title={title}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          confirmLoading={confirmLoading}
          destroyOnClose={destroyOnClose}
          maskClosable={maskClosable}
        >
          <ErrorMessage errors={formErrors} />
          <Form
            ref={this.formRef}
            layout='vertical'
            colon={false}
            hideRequiredMark
            initialValues={formObject}
          >
            <Form.Item
              name='scheduledTime'
              label='Scheduled Time'
              hasFeedback
            >
              <DatePicker
                showTime
                format='YYYY-MM-DD HH:mm:ss'
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              name='name'
              label='Name'
              hasFeedback
            >
              <Input placeholder='Name' />
            </Form.Item>
            <Divider orientation='left'>Participants</Divider>
            <Form.List
              name='participants'
              rules={[
                {
                  validator: async (_, participants) => {
                    return !participants || participants.length < 1
                      ? Promise.reject(new Error('At least 1 participants'))
                      : Promise.resolve();
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <React.Fragment>
                  {fields.map((field) => (
                    <React.Fragment key={field.key}>
                      <Row key={field.key} align='start'>
                        <Col span={22}>
                          <Form.Item
                            name={[field.name, 'email']}
                            rules={[
                              { type: 'email', message: 'Email is not valid' },
                              { required: true, message: 'Email is required' },
                            ]}
                          >
                            <Input placeholder='Email' />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <MinusCircleOutlined
                            style={{
                              color: '#ff4d4f',
                              marginLeft: 8.5,
                              marginTop: 8.5,
                            }}
                            onClick={() => remove(field.name)}
                          />
                        </Col>
                      </Row>
                    </React.Fragment>
                  ))}
                  <Form.Item>
                    <Button
                      type='dashed'
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      Add participants
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </React.Fragment>
              )}
            </Form.List>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default MeetForm;
