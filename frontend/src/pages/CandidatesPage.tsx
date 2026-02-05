import { useMemo, useState } from 'react';
import {
  Badge,
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Drawer,
  Flex,
  Input,
  Row,
  Segmented,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';

type CandidateStatus = 'Новый' | 'В работе' | 'Назначено' | 'Закрыт';
type HrAssignee = 'Я' | 'Анна Петрова' | 'Мария Соколова' | 'Дмитрий Федоров';
type RecruitingModel = 'Рекрутинг' | 'Ресечинг' | 'Самонабор';

type Candidate = {
  id: string;
  createdAt: string;
  author: string;
  status: CandidateStatus;
  fullName: string;
  phone: string;
  email: string;
  hrAssignee: HrAssignee;
  hrRole: string;
  hrPhone: string;
  vacancyTag: string;
  city: string;
  office: string;
  advertisingChannel: string;
  attractionType: string;
  age: number;
  researcher: string;
  recruitingModel: RecruitingModel;
  referrer: string;
  vacancy: string;
  resumeLink: string;
  nextContactDate: string;
  plannedInterviewDate: string;
  actualInterviewDate: string;
  managerInterviewDate: string;
  note: string;
  contactResult: string;
};

type CandidateComment = {
  id: string;
  author: string;
  date: string;
  text: string;
};

type CandidateFilters = {
  status?: CandidateStatus;
  hrAssignee?: HrAssignee;
  city?: string;
  vacancyTag?: string;
};

type CandidatesPageProps = {
  selectedCandidateId: string | null;
  onOpenCandidate: (candidateId: string) => void;
  onCloseCandidate: () => void;
};

const mockCandidates: Candidate[] = [
  {
    id: '10024',
    createdAt: '22.01.2025 09:45',
    author: 'Елена Воронова',
    status: 'Новый',
    fullName: 'Иван Петров',
    phone: '+7 (999) 111-22-33',
    email: 'ivan.petrov@gmail.com',
    hrAssignee: 'Я',
    hrRole: 'Ведущий рекрутер',
    hrPhone: '+7 (923) 333-12-10',
    vacancyTag: 'Вторичная',
    city: 'Москва',
    office: 'Офис ЦАО',
    advertisingChannel: 'hh.ru',
    attractionType: 'Холодный поиск',
    age: 27,
    researcher: 'Ольга Савина',
    recruitingModel: 'Рекрутинг',
    referrer: 'Алексей Гусев',
    vacancy: 'Менеджер по продажам',
    resumeLink: 'https://example.com/resume/10024',
    nextContactDate: '2025-01-19',
    plannedInterviewDate: '2025-01-21',
    actualInterviewDate: '2025-01-22',
    managerInterviewDate: '2025-01-24',
    note: 'Кандидат с сильным опытом в b2b-продажах. Важно обсудить мотивацию перехода и готовность к гибридному графику.',
    contactResult: 'Ожидает звонка',
  },
  {
    id: '10025',
    createdAt: '22.01.2025 10:10',
    author: 'Сергей Литвинов',
    status: 'В работе',
    fullName: 'Ольга Иванова',
    phone: '+7 (999) 444-55-66',
    email: 'olga.ivanova@yandex.ru',
    hrAssignee: 'Анна Петрова',
    hrRole: 'HR бизнес-партнер',
    hrPhone: '+7 (911) 654-45-11',
    vacancyTag: 'Первичная',
    city: 'Санкт-Петербург',
    office: 'Петроградский офис',
    advertisingChannel: 'Telegram',
    attractionType: 'Реферальная программа',
    age: 30,
    researcher: 'Максим Орлов',
    recruitingModel: 'Ресечинг',
    referrer: 'Ирина Комарова',
    vacancy: 'Account manager',
    resumeLink: 'https://example.com/resume/10025',
    nextContactDate: '2025-01-25',
    plannedInterviewDate: '2025-01-27',
    actualInterviewDate: '2025-01-28',
    managerInterviewDate: '2025-01-30',
    note: 'Запросила удаленный формат 2 дня в неделю, ожидает обратную связь.',
    contactResult: 'Назначен скрининг',
  },
  {
    id: '10026',
    createdAt: '22.01.2025 11:05',
    author: 'Елена Воронова',
    status: 'Назначено',
    fullName: 'Алексей Смирнов',
    phone: '+7 (999) 777-88-99',
    email: 'smirnov.alexey@mail.ru',
    hrAssignee: 'Мария Соколова',
    hrRole: 'Senior HR',
    hrPhone: '+7 (921) 998-12-21',
    vacancyTag: 'Backend',
    city: 'Казань',
    office: 'Казань Digital Hub',
    advertisingChannel: 'LinkedIn',
    attractionType: 'Отклик',
    age: 33,
    researcher: 'Евгений Борисов',
    recruitingModel: 'Рекрутинг',
    referrer: '—',
    vacancy: 'Backend разработчик',
    resumeLink: 'https://example.com/resume/10026',
    nextContactDate: '2025-01-26',
    plannedInterviewDate: '2025-01-29',
    actualInterviewDate: '2025-01-29',
    managerInterviewDate: '2025-01-31',
    note: 'Сильная техническая экспертиза, необходима проверка soft skills.',
    contactResult: 'Интервью подтверждено',
  },
  {
    id: '10027',
    createdAt: '22.01.2025 12:20',
    author: 'Сергей Литвинов',
    status: 'Закрыт',
    fullName: 'Марина Кузнецова',
    phone: '+7 (999) 121-21-21',
    email: 'marina.kuznetsova@mail.ru',
    hrAssignee: 'Дмитрий Федоров',
    hrRole: 'HR specialist',
    hrPhone: '+7 (901) 455-67-89',
    vacancyTag: 'Frontend',
    city: 'Новосибирск',
    office: 'Новосибирск Center',
    advertisingChannel: 'hh.ru',
    attractionType: 'Отклик',
    age: 29,
    researcher: '—',
    recruitingModel: 'Самонабор',
    referrer: '—',
    vacancy: 'Frontend разработчик',
    resumeLink: 'https://example.com/resume/10027',
    nextContactDate: '2025-01-20',
    plannedInterviewDate: '2025-01-22',
    actualInterviewDate: '2025-01-23',
    managerInterviewDate: '2025-01-24',
    note: 'Отказ по финансовым ожиданиям.',
    contactResult: 'Оффер отклонен',
  },
];

const mockCommentsByCandidateId: Record<string, CandidateComment[]> = {
  '10024': [
    {
      id: 'c-1',
      author: 'Елена Воронова',
      date: '22.01.2025 10:15',
      text: 'Первичный контакт состоялся, кандидат заинтересован в вакансии.',
    },
    {
      id: 'c-2',
      author: 'Анна Петрова',
      date: '22.01.2025 12:05',
      text: 'Запросили обновленное резюме и портфолио проектов.',
    },
  ],
  '10025': [
    {
      id: 'c-3',
      author: 'Сергей Литвинов',
      date: '22.01.2025 13:40',
      text: 'Подтверждено время скрининга на завтра.',
    },
  ],
};

const statusOptions = [
  { value: 'Новый', label: 'Новый' },
  { value: 'В работе', label: 'В работе' },
  { value: 'Назначено', label: 'Назначено' },
  { value: 'Закрыт', label: 'Закрыт' },
];

const hrOptions = [
  { value: 'Я', label: 'Я' },
  { value: 'Анна Петрова', label: 'Анна Петрова' },
  { value: 'Мария Соколова', label: 'Мария Соколова' },
  { value: 'Дмитрий Федоров', label: 'Дмитрий Федоров' },
];

const cityOptions = Array.from(
  new Set(mockCandidates.map((candidate) => candidate.city)),
).map((city) => ({
  value: city,
  label: city,
}));

const vacancyOptions = Array.from(
  new Set(mockCandidates.map((candidate) => candidate.vacancyTag)),
).map((vacancyTag) => ({
  value: vacancyTag,
  label: vacancyTag,
}));

export function CandidatesPage({
  selectedCandidateId,
  onOpenCandidate,
  onCloseCandidate,
}: CandidatesPageProps) {
  const [filters, setFilters] = useState<CandidateFilters>({});
  const [commentsByCandidateId, setCommentsByCandidateId] = useState(
    mockCommentsByCandidateId,
  );
  const [commentDraft, setCommentDraft] = useState('');

  const filteredCandidates = useMemo(
    () =>
      mockCandidates.filter((candidate) => {
        const byStatus = !filters.status || candidate.status === filters.status;
        const byHr =
          !filters.hrAssignee || candidate.hrAssignee === filters.hrAssignee;
        const byCity = !filters.city || candidate.city === filters.city;
        const byVacancy =
          !filters.vacancyTag || candidate.vacancyTag === filters.vacancyTag;

        return byStatus && byHr && byCity && byVacancy;
      }),
    [filters],
  );

  const selectedCandidate = useMemo(
    () =>
      mockCandidates.find(
        (candidate) => candidate.id === selectedCandidateId,
      ) ?? null,
    [selectedCandidateId],
  );

  const isOverdue = selectedCandidate?.nextContactDate
    ? dayjs(selectedCandidate.nextContactDate).isBefore(dayjs(), 'day')
    : false;

  const comments = selectedCandidate
    ? (commentsByCandidateId[selectedCandidate.id] ?? [])
    : [];

  const columns: TableColumnsType<Candidate> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (_, candidate) => (
        <Typography.Link onClick={() => onOpenCandidate(candidate.id)}>
          {candidate.id}
        </Typography.Link>
      ),
    },
    { title: 'Создано', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
    { title: 'Автор', dataIndex: 'author', key: 'author', width: 180 },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: CandidateStatus) => (
        <Badge
          status={status === 'Новый' ? 'processing' : 'default'}
          text={status}
        />
      ),
    },
    {
      title: 'Контакт',
      key: 'contact',
      width: 240,
      render: (_, candidate) => (
        <Space direction="vertical" size={0}>
          <Typography.Text>{candidate.fullName}</Typography.Text>
          <Typography.Text type="secondary">{candidate.phone}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Ответственный HR',
      dataIndex: 'hrAssignee',
      key: 'hrAssignee',
      width: 200,
    },
    {
      title: 'На вакансию',
      dataIndex: 'vacancyTag',
      key: 'vacancyTag',
      width: 150,
      render: (vacancyTag: string) => <Tag>{vacancyTag}</Tag>,
    },
    { title: 'Город', dataIndex: 'city', key: 'city', width: 150 },
    {
      title: 'Дата следующего контакта',
      dataIndex: 'nextContactDate',
      key: 'nextContactDate',
      width: 220,
      render: (value: string) => dayjs(value).format('DD.MM.YYYY'),
    },
    {
      title: 'Результат контакта',
      dataIndex: 'contactResult',
      key: 'contactResult',
      width: 220,
    },
  ];

  const handleAddComment = () => {
    if (!selectedCandidate || !commentDraft.trim()) {
      return;
    }

    const nextComment: CandidateComment = {
      id: `${selectedCandidate.id}-${Date.now()}`,
      author: 'Вы',
      date: dayjs().format('DD.MM.YYYY HH:mm'),
      text: commentDraft.trim(),
    };

    setCommentsByCandidateId((prev) => ({
      ...prev,
      [selectedCandidate.id]: [
        ...(prev[selectedCandidate.id] ?? []),
        nextComment,
      ],
    }));
    setCommentDraft('');
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Typography.Title level={2} style={{ marginBottom: 0 }}>
        Кандидаты
      </Typography.Title>
      <Space wrap>
        <Select
          placeholder="Статус"
          style={{ width: 180 }}
          options={statusOptions}
          value={filters.status}
          allowClear
          onChange={(status) => setFilters((prev) => ({ ...prev, status }))}
        />
        <Select
          placeholder="Ответственный HR"
          style={{ width: 220 }}
          options={hrOptions}
          value={filters.hrAssignee}
          allowClear
          onChange={(hrAssignee) =>
            setFilters((prev) => ({ ...prev, hrAssignee }))
          }
        />
        <Select
          placeholder="Город"
          style={{ width: 180 }}
          options={cityOptions}
          value={filters.city}
          allowClear
          onChange={(city) => setFilters((prev) => ({ ...prev, city }))}
        />
        <Select
          placeholder="Вакансия"
          style={{ width: 180 }}
          options={vacancyOptions}
          value={filters.vacancyTag}
          allowClear
          onChange={(vacancyTag) =>
            setFilters((prev) => ({ ...prev, vacancyTag }))
          }
        />
        <Button onClick={() => setFilters({})}>Сбросить</Button>
      </Space>

      <Table
        rowKey="id"
        dataSource={filteredCandidates}
        columns={columns}
        pagination={false}
        scroll={{ x: 1700 }}
        onRow={(candidate) => ({
          onClick: () => onOpenCandidate(candidate.id),
          style: { cursor: 'pointer' },
        })}
      />

      <Drawer
        title={null}
        placement="right"
        width="75vw"
        open={Boolean(selectedCandidate)}
        onClose={onCloseCandidate}
        destroyOnClose
        extra={
          <Space>
            <Button type="primary">Назначить собеседование</Button>
            <Button>Действия</Button>
          </Space>
        }
      >
        {selectedCandidate ? (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Space direction="vertical" size={0}>
              <Breadcrumb
                items={[
                  { title: 'Кандидаты' },
                  {
                    title: `${selectedCandidate.fullName} ${selectedCandidate.phone}`,
                  },
                ]}
              />
              <Typography.Text type="secondary">
                ID {selectedCandidate.id} · Создан:{' '}
                {selectedCandidate.createdAt}
              </Typography.Text>
            </Space>

            <Row gutter={24} align="top">
              <Col span={15}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: '100%' }}
                >
                  <Space
                    direction="vertical"
                    size={8}
                    style={{ width: '100%' }}
                  >
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      Основная информация
                    </Typography.Title>
                    <Flex vertical gap={12}>
                      <Space direction="vertical" size={0}>
                        <Typography.Text strong>Статус</Typography.Text>
                        <Select
                          value={selectedCandidate.status}
                          options={statusOptions}
                        />
                      </Space>

                      <Space
                        direction="vertical"
                        style={{
                          border: '1px solid #f0f0f0',
                          borderRadius: 8,
                          padding: 12,
                        }}
                      >
                        <Flex justify="space-between" align="center">
                          <Typography.Text strong>Контакт</Typography.Text>
                          <Button size="small">Изменить</Button>
                        </Flex>
                        <Typography.Text>
                          {selectedCandidate.fullName}
                        </Typography.Text>
                        <Typography.Text>
                          {selectedCandidate.phone}
                        </Typography.Text>
                        <Typography.Text>
                          {selectedCandidate.email}
                        </Typography.Text>
                      </Space>

                      <Space
                        direction="vertical"
                        style={{
                          border: '1px solid #f0f0f0',
                          borderRadius: 8,
                          padding: 12,
                        }}
                      >
                        <Flex justify="space-between" align="center">
                          <Typography.Text strong>
                            Ответственный HR
                          </Typography.Text>
                          <Button size="small">Изменить</Button>
                        </Flex>
                        <Typography.Text>
                          {selectedCandidate.hrAssignee}
                        </Typography.Text>
                        <Typography.Text type="secondary">
                          {selectedCandidate.hrRole}
                        </Typography.Text>
                        <Typography.Text>
                          {selectedCandidate.hrPhone}
                        </Typography.Text>
                      </Space>
                    </Flex>
                  </Space>

                  <Space
                    direction="vertical"
                    size={8}
                    style={{ width: '100%' }}
                  >
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      Поля кандидата
                    </Typography.Title>
                    <Row gutter={[12, 12]}>
                      <Col span={12}>
                        <Typography.Text>Город *</Typography.Text>
                        <Input value={selectedCandidate.city} />
                      </Col>
                      <Col span={12}>
                        <Typography.Text>Офис</Typography.Text>
                        <Input value={selectedCandidate.office} />
                      </Col>
                      <Col span={12}>
                        <Typography.Text>На вакансию *</Typography.Text>
                        <Input value={selectedCandidate.vacancyTag} />
                      </Col>
                      <Col span={12}>
                        <Typography.Text>Рекламный канал *</Typography.Text>
                        <Input value={selectedCandidate.advertisingChannel} />
                      </Col>
                      <Col span={12}>
                        <Typography.Text>Тип привлечения *</Typography.Text>
                        <Input value={selectedCandidate.attractionType} />
                      </Col>
                      <Col span={12}>
                        <Typography.Text>Возраст</Typography.Text>
                        <Input value={String(selectedCandidate.age)} />
                      </Col>
                      <Col span={12}>
                        <Typography.Text>Ресечер</Typography.Text>
                        <Input value={selectedCandidate.researcher} />
                      </Col>
                      <Col span={12}>
                        <Typography.Text>Модель подбора</Typography.Text>
                        <Segmented<RecruitingModel>
                          block
                          options={['Рекрутинг', 'Ресечинг', 'Самонабор']}
                          value={selectedCandidate.recruitingModel}
                        />
                      </Col>
                      <Col span={12}>
                        <Typography.Text>Рекомендатель</Typography.Text>
                        <Input value={selectedCandidate.referrer} />
                      </Col>
                      <Col span={12}>
                        <Typography.Text>Вакансия</Typography.Text>
                        <Input value={selectedCandidate.vacancy} />
                      </Col>
                      <Col span={24}>
                        <Typography.Text>Ссылка на резюме</Typography.Text>
                        <Input value={selectedCandidate.resumeLink} />
                      </Col>
                      <Col span={24}>
                        <Space align="center">
                          <Typography.Text>
                            Дата следующего контакта
                          </Typography.Text>
                          {isOverdue ? (
                            <Tag color="error">Просрочена</Tag>
                          ) : null}
                        </Space>
                        <DatePicker
                          style={{ width: '100%' }}
                          value={dayjs(selectedCandidate.nextContactDate)}
                          format="DD.MM.YYYY"
                        />
                      </Col>
                      <Col span={8}>
                        <Typography.Text>Интервью (план)</Typography.Text>
                        <DatePicker
                          style={{ width: '100%' }}
                          value={dayjs(selectedCandidate.plannedInterviewDate)}
                          format="DD.MM.YYYY"
                        />
                      </Col>
                      <Col span={8}>
                        <Typography.Text>Интервью (факт)</Typography.Text>
                        <DatePicker
                          style={{ width: '100%' }}
                          value={dayjs(selectedCandidate.actualInterviewDate)}
                          format="DD.MM.YYYY"
                        />
                      </Col>
                      <Col span={8}>
                        <Typography.Text>С руководителем</Typography.Text>
                        <DatePicker
                          style={{ width: '100%' }}
                          value={dayjs(selectedCandidate.managerInterviewDate)}
                          format="DD.MM.YYYY"
                        />
                      </Col>
                    </Row>
                  </Space>

                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      Примечание
                    </Typography.Title>
                    <Input.TextArea value={selectedCandidate.note} rows={6} />
                  </Space>
                </Space>
              </Col>

              <Col span={9}>
                <Tabs
                  defaultActiveKey="comments"
                  items={[
                    {
                      key: 'comments',
                      label: 'Комментарии',
                      children: (
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Space direction="vertical" style={{ width: '100%' }}>
                            {comments.length ? (
                              comments.map((comment) => (
                                <Space
                                  key={comment.id}
                                  direction="vertical"
                                  size={0}
                                  style={{
                                    border: '1px solid #f0f0f0',
                                    borderRadius: 8,
                                    padding: 12,
                                    width: '100%',
                                  }}
                                >
                                  <Typography.Text strong>
                                    {comment.author}
                                  </Typography.Text>
                                  <Typography.Text type="secondary">
                                    {comment.date}
                                  </Typography.Text>
                                  <Typography.Text>
                                    {comment.text}
                                  </Typography.Text>
                                </Space>
                              ))
                            ) : (
                              <Typography.Text type="secondary">
                                Пока нет комментариев
                              </Typography.Text>
                            )}
                          </Space>

                          <Space direction="vertical" style={{ width: '100%' }}>
                            <Typography.Text strong>
                              Добавьте комментарий
                            </Typography.Text>
                            <Input.TextArea
                              rows={4}
                              value={commentDraft}
                              onChange={(event) =>
                                setCommentDraft(event.target.value)
                              }
                            />
                            <Button type="primary" onClick={handleAddComment}>
                              Добавить комментарий
                            </Button>
                          </Space>
                        </Space>
                      ),
                    },
                    {
                      key: 'tasks',
                      label: 'Задачи',
                      children: (
                        <Typography.Text type="secondary">
                          Раздел задач будет реализован позже.
                        </Typography.Text>
                      ),
                    },
                  ]}
                />
              </Col>
            </Row>
          </Space>
        ) : null}
      </Drawer>
    </Space>
  );
}
