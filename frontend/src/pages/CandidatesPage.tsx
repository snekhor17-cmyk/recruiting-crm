import { useMemo, useState } from 'react';
import { Badge, Button, Select, Space, Table, Tag, Typography } from 'antd';
import type { TableColumnsType } from 'antd';

type CandidateStatus = 'Новый' | 'В работе' | 'Назначено' | 'Закрыт';
type HrAssignee = 'Я' | 'Анна Петрова' | 'Мария Соколова' | 'Дмитрий Федоров';

type Candidate = {
  id: string;
  createdAt: string;
  author: string;
  status: CandidateStatus;
  fullName: string;
  phone: string;
  hrAssignee: HrAssignee;
  vacancyTag: string;
  city: string;
  nextContactDate: string;
  contactResult: string;
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
};

const mockCandidates: Candidate[] = [
  {
    id: '10024',
    createdAt: '22.01.2025 09:45',
    author: 'Елена Воронова',
    status: 'Новый',
    fullName: 'Иван Петров',
    phone: '+7 (999) 111-22-33',
    hrAssignee: 'Я',
    vacancyTag: 'Вторичная',
    city: 'Москва',
    nextContactDate: '24.01.2025',
    contactResult: 'Ожидает звонка',
  },
  {
    id: '10025',
    createdAt: '22.01.2025 10:10',
    author: 'Сергей Литвинов',
    status: 'В работе',
    fullName: 'Ольга Иванова',
    phone: '+7 (999) 444-55-66',
    hrAssignee: 'Анна Петрова',
    vacancyTag: 'Первичная',
    city: 'Санкт-Петербург',
    nextContactDate: '25.01.2025',
    contactResult: 'Назначен скрининг',
  },
  {
    id: '10026',
    createdAt: '22.01.2025 11:05',
    author: 'Елена Воронова',
    status: 'Назначено',
    fullName: 'Алексей Смирнов',
    phone: '+7 (999) 777-88-99',
    hrAssignee: 'Мария Соколова',
    vacancyTag: 'Backend',
    city: 'Казань',
    nextContactDate: '26.01.2025',
    contactResult: 'Интервью подтверждено',
  },
  {
    id: '10027',
    createdAt: '22.01.2025 12:20',
    author: 'Сергей Литвинов',
    status: 'Закрыт',
    fullName: 'Марина Кузнецова',
    phone: '+7 (999) 121-21-21',
    hrAssignee: 'Дмитрий Федоров',
    vacancyTag: 'Frontend',
    city: 'Новосибирск',
    nextContactDate: '—',
    contactResult: 'Оффер отклонен',
  },
];

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
}: CandidatesPageProps) {
  const [filters, setFilters] = useState<CandidateFilters>({});

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
    },
    {
      title: 'Результат контакта',
      dataIndex: 'contactResult',
      key: 'contactResult',
      width: 220,
    },
  ];

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

      {selectedCandidateId ? (
        <Typography.Text type="secondary">
          Открыта карточка кандидата #{selectedCandidateId} (детали будут
          добавлены в следующем issue).
        </Typography.Text>
      ) : null}

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
    </Space>
  );
}
