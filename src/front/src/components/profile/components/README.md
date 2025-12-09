# 🧩 Componentes do Perfil

Esta pasta contém os componentes modulares do perfil do desenvolvedor, resultado da refatoração do arquivo `ProfilePage.tsx` (que tinha 1405 linhas).

## 📦 Componentes

### ProfileHeader.tsx
**Responsabilidade:** Cabeçalho do perfil
- Avatar do usuário
- Nome e título profissional
- Localização
- Links sociais (GitHub, LinkedIn, Portfólio)
- Botões de ação (Editar/Salvar/Cancelar)

**Props:**
```typescript
interface ProfileHeaderProps {
  user: User | null;
  headline: string;
  location: string;
  links: Links;
  editMode: boolean;
  saving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onBack: () => void;
}
```

---

### ProfileAboutTab.tsx
**Responsabilidade:** Aba "Sobre"
- Título profissional
- Resumo/biografia
- Localização
- Links e redes sociais

**Props:**
```typescript
interface ProfileAboutTabProps {
  editMode: boolean;
  headline: string;
  summary: string;
  location: string;
  links: Links;
  onHeadlineChange: (value: string) => void;
  onSummaryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onLinkChange: (field: keyof Links, value: string) => void;
}
```

---

### ProfileExperiencesTab.tsx
**Responsabilidade:** Aba "Experiências"
- Lista de experiências profissionais
- Adicionar nova experiência
- Editar experiência existente
- Remover experiência

**Props:**
```typescript
interface ProfileExperiencesTabProps {
  editMode: boolean;
  experiences: Experience[];
  onExperienceChange: (index: number, field: keyof Experience, value: any) => void;
  onAddExperience: () => void;
  onRemoveExperience: (index: number) => void;
}
```

---

### ProfileEducationTab.tsx
**Responsabilidade:** Aba "Formação"
- Formação acadêmica
- Certificações
- Adicionar/editar/remover itens

**Props:**
```typescript
interface ProfileEducationTabProps {
  editMode: boolean;
  education: Education[];
  certifications: Certification[];
  onEducationChange: (index: number, field: keyof Education, value: string) => void;
  onCertificationChange: (index: number, field: keyof Certification, value: string) => void;
  onAddEducation: () => void;
  onRemoveEducation: (index: number) => void;
  onAddCertification: () => void;
  onRemoveCertification: (index: number) => void;
}
```

---

### ProfileSkillsTab.tsx
**Responsabilidade:** Aba "Habilidades"
- Linguagens de programação
- Frameworks e bibliotecas
- Bancos de dados
- Ferramentas e DevOps
- Habilidades soft

**Props:**
```typescript
interface ProfileSkillsTabProps {
  editMode: boolean;
  skills: Skills;
  skillOptions: SkillOptions;
  onSkillChange: (category: keyof Skills, value: string[]) => void;
}
```

---

### ProfileProjectsTab.tsx
**Responsabilidade:** Aba "Projetos"
- Lista de projetos pessoais
- Descrição, tecnologias, links
- Adicionar/editar/remover projetos

**Props:**
```typescript
interface ProfileProjectsTabProps {
  editMode: boolean;
  projects: Project[];
  onProjectChange: (index: number, field: keyof Project, value: string) => void;
  onAddProject: () => void;
  onRemoveProject: (index: number) => void;
}
```

---

### ProfilePreferencesTab.tsx
**Responsabilidade:** Aba "Preferências"
- Pretensão salarial
- Tipo de contrato (CLT, PJ, etc.)
- Modalidade de trabalho (Remoto, Híbrido, Presencial)
- Disponibilidade
- Preferências de vaga
- Idiomas

**Props:**
```typescript
interface ProfilePreferencesTabProps {
  editMode: boolean;
  preferences: Preferences;
  onPreferenceChange: (field: keyof Preferences, value: any) => void;
}
```

---

## 🎨 Padrão de Design

Todos os componentes seguem o mesmo padrão:

1. **Modo de Visualização:** Exibe informações de forma organizada
2. **Modo de Edição:** Permite editar informações inline
3. **Props Tipadas:** TypeScript com interfaces bem definidas
4. **Callbacks:** Funções de onChange para comunicação com o componente pai
5. **Material-UI:** Uso consistente dos componentes do Material-UI

---

## 🔄 Como Usar

```tsx
import ProfileHeader from '../components/profile/components/ProfileHeader';
import ProfileAboutTab from '../components/profile/components/ProfileAboutTab';
// ... outros imports

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({ /* ... */ });

  return (
    <Box>
      <ProfileHeader
        user={user}
        headline={formData.headline}
        location={formData.location}
        links={formData.links}
        editMode={editMode}
        saving={saving}
        onEdit={() => setEditMode(true)}
        onSave={handleSave}
        onCancel={handleCancelEdit}
        onBack={() => navigate('/')}
      />

      <TabPanel value={activeTab} index={0}>
        <ProfileAboutTab
          editMode={editMode}
          headline={formData.headline}
          summary={formData.summary}
          location={formData.location}
          links={formData.links}
          onHeadlineChange={(value) => handleChange('headline', value)}
          onSummaryChange={(value) => handleChange('summary', value)}
          onLocationChange={(value) => handleChange('location', value)}
          onLinkChange={(field, value) => handleNestedChange('links', field, value)}
        />
      </TabPanel>

      {/* Outras abas... */}
    </Box>
  );
};
```

---

## 📊 Benefícios da Componentização

✅ **Código Organizado:** Cada componente tem uma responsabilidade clara  
✅ **Reutilização:** Componentes podem ser usados em outras partes do app  
✅ **Testabilidade:** Mais fácil escrever testes unitários  
✅ **Manutenibilidade:** Mudanças localizadas em componentes específicos  
✅ **Legibilidade:** Arquivos menores são mais fáceis de entender  

---

## 🚀 Próximas Melhorias

- [ ] Adicionar validação de formulários com `react-hook-form`
- [ ] Implementar testes com React Testing Library
- [ ] Documentar no Storybook
- [ ] Adicionar animações de transição
- [ ] Implementar debounce no auto-save

