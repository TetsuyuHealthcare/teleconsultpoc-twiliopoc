import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  PageHeader,
  Breadcrumb,
  Card,
  Space,
  Table,
  Tag,
  Button,
  Popconfirm,
} from 'antd';
import {
  LinkOutlined,
  EditOutlined,
  DeleteOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import MeetForm from './MeetForm';
import MeetLink from './MeetLink';

import {
  fetchMeets,
  createMeet,
  updateMeet,
  deleteMeet,
} from '../../../actions/meetActions';
import { clearErrors } from '../../../actions/errorActions';
import { displayDate, parseDate } from '../../../utils/dateUtils';

const reactAppHost = process.env.REACT_APP_HOST;

class MeetListContainer extends Component {
  static initialFormState = {
    formType: null,
    formObject: null,
    formErrors: null,
    formVisible: false,
    linksData: null,
    linksVisible: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...this.constructor.initialFormState,
    };
  }

  static getDerivedStateFromProps(props, state) {
    switch (state.formType) {
      case 'create':
        return {
          formErrors: props.createErrors,
        };
      case 'update':
        return {
          formErrors: props.updateErrors,
        };
      default:
        return {
          formErrors: null,
        };
    }
  }

  componentDidMount() {
    const { fetchMeets, page, limit } = this.props;
    fetchMeets({ page, limit });
  }

  handleRefreshMeets() {
    const { fetchMeets } = this.props;
    fetchMeets({ page: 1, limit: 25 });
  }

  handleOkForm = ({ id, ...submittedData }) => {
    const { formType } = this.state;
    const { createMeet, updateMeet } = this.props;

    if (formType === 'create') {
      createMeet(submittedData).then(() => {
        this.setState({ ...this.constructor.initialFormState });
        this.handleRefreshMeets();
      });
    }

    if (formType === 'update') {
      updateMeet(id, submittedData).then(() => {
        this.setState({ ...this.constructor.initialFormState });
        this.handleRefreshMeets();
      });
    }
  };

  handleCancleForm = () => {
    const { clearErrors } = this.props;

    this.setState({ ...this.constructor.initialFormState });
    clearErrors(['createMeet', 'updateMeet']);
  };

  handleClickAddNewMeet = () => {
    this.setState({
      formVisible: true,
      formType: 'create',
      formObject: {
        name: null,
        scheduledTime: null,
        participants: [{}],
      },
    });
  };

  handleClickEditMeet = (meet) => {
    this.setState({
      formVisible: true,
      formType: 'update',
      formObject: {
        id: meet.id,
        name: meet.name,
        scheduledTime: meet.scheduledTime && parseDate(meet.scheduledTime),
        participants: meet.participants,
      },
    });
  };

  handleClickDeleteMeet = ({ id }) => {
    const { deleteMeet } = this.props;

    deleteMeet(id).then(() => {
      this.handleRefreshMeets();
    });
  };

  handleClickShowMeetLinks = (meet) => {
    const participantLinks = meet.participants.map(participant => ({
      email: participant.email,
      url: `${reactAppHost}/rooms/${meet.id}/participants/${participant.id}`,
    }));

    this.setState({
      linksData: participantLinks,
      linksVisible: true,
    });
  }

  handleCancelLinks = () => {
    this.setState({
      linksData: null,
      linksVisible: false,
    });
  }

  onChangePagination = (page, limit) => {
    const { fetchMeets } = this.props;
    fetchMeets({ page, limit });
  };

  render() {
    const {
      items,
      totalCount,
      page,
      limit,
      loading
    } = this.props;

    const {
      formVisible,
      formType,
      formErrors,
      formObject,
      linksVisible,
      linksData,
    } = this.state;

    return (
      <div className='admin-page admin-meet-list-container'>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Space>
              <WhatsAppOutlined />
              Admin
            </Space>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Meets</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <PageHeader
            title='Meets'
            extra={[
              <Button
                type='primary'
                key='newMeet'
                onClick={this.handleClickAddNewMeet}
              >
                Add New Meet
              </Button>,
            ]}
          />
          <Table
            rowKey='id'
            dataSource={items}
            columns={[
              {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (name) => {
                  return name || '[NO_NAME]';
                }
              },
              {
                title: 'Participants',
                dataIndex: 'participants',
                key: 'participants',
                render: (participants) => {
                  return (
                    <React.Fragment>
                      {participants.map((participant) => (
                        <Tag color='blue' key={participant.id}>
                          {participant.email}
                        </Tag>
                      ))}
                    </React.Fragment>
                  );
                },
              },
              {
                title: 'Scheduled Time',
                dataIndex: 'scheduledTime',
                key: 'scheduledTime',
                render: (scheduledTime) => {
                  return scheduledTime
                    ? displayDate(scheduledTime)
                    : '[NO_SCHEDULED_TIME]';
                },
              },
              {
                title: 'Links',
                dataIndex: 'links',
                key: 'links',
                render: (_, meet) => (
                  <Button
                    type='dashed'
                    icon={<LinkOutlined />}
                    onClick={() => this.handleClickShowMeetLinks(meet)}
                  />
                )
              },
              {
                title: 'Action',
                key: 'action',
                render: (_, meet) => (
                  <Space size='middle'>
                    <Button
                      type='dashed'
                      icon={<EditOutlined />}
                      onClick={() => this.handleClickEditMeet(meet)}
                    />
                    <Popconfirm
                      title='Are you sure to delete?'
                      onConfirm={() => this.handleClickDeleteMeet(meet)}
                      okText='Yes'
                      cancelText='No'
                    >
                      <Button danger type='dashed' icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
            loading={loading}
            pagination={{
              onChange: this.onChangePagination,
              defaultCurrent: page,
              defaultPageSize: limit,
              total: totalCount,
            }}
          />
        </Card>
        <MeetForm
          formType={formType}
          formErrors={formErrors}
          formObject={formObject}
          visible={formVisible}
          onOk={this.handleOkForm}
          onCancel={this.handleCancleForm}
          confirmLoading={loading}
          maskClosable={false}
          destroyOnClose
        />
        <MeetLink
          data={linksData}
          title='Meet links'
          visible={linksVisible}
          onCancel={this.handleCancelLinks}
          maskClosable={false}
          destroyOnClose
        />
      </div>
    );
  }
}

const mapStateToProps = ({ meet, error }) => ({
  items: meet.items,
  totalCount: meet.totalCount,
  page: meet.page,
  limit: meet.limit,
  loading: meet.loading,
  createErrors: error.createMeet,
  updateErrors: error.updateMeet,
});

export default connect(mapStateToProps, {
  fetchMeets,
  createMeet,
  updateMeet,
  deleteMeet,
  clearErrors,
})(MeetListContainer);
