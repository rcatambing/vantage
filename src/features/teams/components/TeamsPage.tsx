import React, { useState } from 'react';
import { Button, H2, HTMLTable, Dialog, FormGroup, InputGroup, TextArea } from '@blueprintjs/core';

interface Team {
  id: string;
  team_name: string;
  description: string;
  status: string;
  member_count: number;
}

const mockTeams: Team[] = [
  { id: '1', team_name: 'Metro Manila Operations', description: 'Central base operations.', status: 'ACTIVE', member_count: 12 },
  { id: '2', team_name: 'Barangay 12 Ground Team', description: 'Survey and outreach.', status: 'ACTIVE', member_count: 8 },
];

export const TeamListTable: React.FC<{ teams: Team[] }> = ({ teams }) => (
  <HTMLTable bordered striped interactive style={{ width: '100%', fontSize: 12 }}>
    <thead>
      <tr>
        <th>Team Name</th>
        <th>Description</th>
        <th>Status</th>
        <th>Members</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {teams.map(team => (
        <tr key={team.id}>
          <td>{team.team_name}</td>
          <td>{team.description}</td>
          <td>{team.status}</td>
          <td>{team.member_count}</td>
          <td>
            <Button icon="edit" small minimal intent="primary" />
            <Button icon="people" small minimal intent="success" />
          </td>
        </tr>
      ))}
    </tbody>
  </HTMLTable>
);

export const TeamCreateDialog: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <Dialog title="Create New Team" isOpen={isOpen} onClose={onClose} icon="add">
      <div className="bp5-dialog-body">
        <FormGroup label="Team Name" labelFor="team-name" labelInfo="(required)">
          <InputGroup id="team-name" placeholder="E.g., Field Survey Team" />
        </FormGroup>
        <FormGroup label="Description" labelFor="team-desc">
          <TextArea id="team-desc" fill placeholder="Purpose of this team..." />
        </FormGroup>
      </div>
      <div className="bp5-dialog-footer">
        <div className="bp5-dialog-footer-actions">
          <Button onClick={onClose}>Cancel</Button>
          <Button intent="primary" onClick={onClose}>Create Team</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default function TeamsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [teams] = useState<Team[]>(mockTeams);

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: 10, borderBottom: '1px solid var(--cds-border-subtle)' }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>Teams Directory</h2>
        <Button icon="add" intent="primary" onClick={() => setIsDialogOpen(true)} small>
          New Team
        </Button>
      </div>
      <TeamListTable teams={teams} />
      <TeamCreateDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
}
