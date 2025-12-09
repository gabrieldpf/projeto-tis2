# 🚀 Deploy do Backend no Fly.io - Guia Completo

## 🌟 Por que Fly.io?

- ✅ **Suporta Java/Spring Boot nativamente**
- ✅ **Serviços sempre ativos** (não "dormem" como Render)
- ✅ **Plano gratuito generoso** (3 VMs compartilhadas)
- ✅ **Muito rápido** (CDN global)
- ✅ **CLI poderoso** para gerenciamento

---

## 📋 Pré-requisitos

1. Conta no GitHub (já tem)
2. Terminal/Command Prompt
3. 10 minutos do seu tempo

---

## 🔧 Passo 1: Instalar Fly CLI

### Windows (Método 1 - Recomendado - Via Chocolatey):

Se você tem Chocolatey instalado:
```powershell
choco install flyctl
```

Se não tem Chocolatey, instale primeiro:
```powershell
# Execute como Administrador
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Depois instale o Fly CLI:
```powershell
choco install flyctl
```

### Windows (Método 2 - Download Manual):

1. Acesse: https://github.com/superfly/flyctl/releases/latest
2. Baixe o arquivo `flyctl_X.X.X_windows_amd64.zip` (onde X.X.X é a versão mais recente)
3. Extraia o arquivo ZIP
4. Copie o executável `flyctl.exe` para uma pasta no seu PATH (ex: `C:\Windows\System32` ou crie `C:\flyctl` e adicione ao PATH)
5. Adicione ao PATH (se necessário):
   - Pressione `Win + R`, digite `sysdm.cpl` e pressione Enter
   - Vá em "Avançado" → "Variáveis de Ambiente"
   - Em "Variáveis do sistema", encontre "Path" e clique em "Editar"
   - Clique em "Novo" e adicione o caminho onde colocou o `flyctl.exe`
   - Clique em "OK" em todas as janelas

### Windows (Método 3 - Via Scoop):

Se você tem Scoop instalado:
```powershell
scoop install flyctl
```

Se não tem Scoop, instale primeiro:
```powershell
# Execute no PowerShell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

Depois instale o Fly CLI:
```powershell
scoop install flyctl
```

### Linux/Mac (Método 1 - Download Manual):

1. Acesse: https://github.com/superfly/flyctl/releases/latest
2. Baixe o arquivo apropriado:
   - Linux: `flyctl_X.X.X_linux_amd64.tar.gz`
   - Mac Intel: `flyctl_X.X.X_macOS_amd64.tar.gz`
   - Mac Apple Silicon: `flyctl_X.X.X_macOS_arm64.tar.gz`
3. Extraia o arquivo:
   ```bash
   tar -xzf flyctl_*.tar.gz
   ```
4. Mova para um diretório no PATH:
   ```bash
   sudo mv flyctl /usr/local/bin/
   ```
5. Torne executável:
   ```bash
   sudo chmod +x /usr/local/bin/flyctl
   ```

### Linux/Mac (Método 2 - Via Homebrew - Mac):

```bash
brew install flyctl
```

### Verificar Instalação:
```bash
flyctl version
# ou
fly version
```

Deve mostrar a versão do Fly CLI.

---

## 🔐 Passo 2: Criar Conta e Fazer Login

1. Acesse: https://fly.io
2. Clique em **"Sign Up"** ou **"Log In"**
3. Faça login com sua conta GitHub
4. No terminal, execute:
   ```bash
   fly auth login
   ```
5. Siga as instruções para autorizar no navegador

---

## 📁 Passo 3: Preparar o Projeto

### 3.1 Navegar até o diretório do backend

```bash
cd src/back
```

### 3.2 Inicializar o Fly.io no projeto

```bash
fly launch
```

O Fly CLI vai fazer algumas perguntas:

**App name:** (deixe em branco para gerar automaticamente, ou digite: `devmatch-backend`)

**Organization:** Selecione sua organização pessoal

**Region:** Escolha a mais próxima (ex: `gru` para São Paulo, `iad` para Virginia)

**Postgres:** Digite `n` (não precisamos, já temos Supabase)

**Redis:** Digite `n` (não precisamos)

**Would you like to deploy now?:** Digite `n` (vamos configurar primeiro)

---

## ⚙️ Passo 4: Configurar o Fly.io

O Fly.io criou um arquivo `fly.toml`. Vamos editá-lo:

### 4.1 Editar fly.toml

Abra o arquivo `src/back/fly.toml` e ajuste para:

```toml
app = "devmatch-backend"  # ou o nome que você escolheu
primary_region = "gru"    # ou a região que você escolheu

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8080"
  JAVA_OPTS = "-Xmx512m"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

[[http_service.checks]]
  interval = "10s"
  timeout = "2s"
  grace_period = "5s"
  method = "GET"
  path = "/api/auth/health"
```

### 4.2 Criar arquivo de build (opcional mas recomendado)

Crie um arquivo `src/back/.dockerignore`:

```
target/
.mvn/
.git/
.gitignore
*.md
```

---

## 🏗️ Passo 5: Configurar Build e Deploy

### 5.1 Verificar se o pom.xml está correto

O Fly.io usa buildpacks que detectam automaticamente Java pelo `pom.xml`. Certifique-se de que:
- ✅ `pom.xml` existe em `src/back/`
- ✅ Java version está definida (já está: Java 21)

### 5.2 Criar Procfile (opcional)

Crie um arquivo `src/back/Procfile`:

```
web: java -jar target/job-posting-backend-0.0.1-SNAPSHOT.jar --server.port=$PORT
```

**⚠️ NOTA:** O Fly.io pode detectar automaticamente, mas o Procfile garante.

---

## 🚀 Passo 6: Fazer Deploy

### 6.1 Build e Deploy

```bash
fly deploy
```

O Fly.io vai:
1. Fazer build da aplicação
2. Criar uma imagem Docker
3. Fazer deploy na nuvem
4. Atribuir uma URL pública

**⏱️ Tempo:** 5-10 minutos na primeira vez

### 6.2 Verificar Logs

Durante o deploy, você verá os logs. Procure por:
- ✅ `Building application`
- ✅ `Successfully built`
- ✅ `Deploying...`
- ✅ `1 desired, 1 placed, 1 healthy`

---

## 🌐 Passo 7: Obter URL do Backend

Após o deploy bem-sucedido, você verá algo como:

```
==> Monitoring: https://fly.io/apps/devmatch-backend/monitoring
New app deployed: https://devmatch-backend.fly.dev
```

**Anote a URL:** `https://devmatch-backend.fly.dev` (ou similar)

---

## 🔧 Passo 8: Configurar Variáveis de Ambiente

### 8.1 Adicionar variáveis de ambiente

```bash
fly secrets set DATABASE_URL="jdbc:postgresql://db.rskgwawrqjuuhnyzjasd.supabase.co:5432/postgres?sslmode=require"
fly secrets set DB_USERNAME="postgres"
fly secrets set DB_PASSWORD="tisdevmatchafglp"
```

**⚠️ IMPORTANTE:** As variáveis de ambiente no Fly.io são segredos (secrets) e não aparecem nos logs.

### 8.2 Verificar variáveis

```bash
fly secrets list
```

---

## 🧪 Passo 9: Testar o Backend

### 9.1 Testar health check

```bash
curl https://devmatch-backend.fly.dev/api/auth/health
```

**Resposta esperada:**
```json
{"status":"OK","message":"Auth service is running"}
```

### 9.2 Verificar logs

```bash
fly logs
```

Você deve ver logs do Spring Boot iniciando.

---

## 🔄 Passo 10: Atualizar Frontend

### 10.1 Atualizar variável no Render (Frontend)

1. Acesse: https://dashboard.render.com
2. Vá no seu **Static Site** (frontend)
3. Clique em **"Environment"**
4. Encontre `VITE_API_URL`
5. Altere para:
   ```
   https://devmatch-backend.fly.dev/api
   ```
   (Use a URL real do seu backend do Fly.io)
6. Salve e faça redeploy

---

## 📊 Passo 11: Gerenciar o App

### Comandos úteis do Fly.io:

```bash
# Ver status do app
fly status

# Ver logs em tempo real
fly logs

# Reiniciar o app
fly apps restart devmatch-backend

# Escalar (aumentar/diminuir recursos)
fly scale count 1

# Ver informações do app
fly info
```

---

## 🔍 Troubleshooting

### Problema: Build falha

**Solução:**
```bash
# Ver logs detalhados
fly logs

# Tentar deploy novamente
fly deploy --verbose
```

### Problema: App não inicia

**Solução:**
1. Verifique os logs: `fly logs`
2. Verifique se a porta está correta (deve ser 8080)
3. Verifique se o JAR foi gerado: `fly ssh console -C "ls -la target/"`

### Problema: Erro de conexão com banco

**Solução:**
1. Verifique se os secrets estão configurados: `fly secrets list`
2. Verifique se o banco Supabase permite conexões do Fly.io (deve permitir)

### Problema: CORS error

**Solução:**
O CORS já está configurado no backend para `https://devmatch-frontend.onrender.com`. Se ainda der erro:
1. Verifique se o backend está rodando: `fly status`
2. Verifique os logs: `fly logs`

---

## 💰 Limites do Plano Gratuito

- **3 VMs compartilhadas** (suficiente para 1-3 apps)
- **160GB de transferência/mês**
- **Apps sempre ativos** (não "dormem")
- **Sem limite de tempo**

---

## 📝 Checklist Final

- [ ] Fly CLI instalado
- [ ] Login realizado (`fly auth login`)
- [ ] App inicializado (`fly launch`)
- [ ] `fly.toml` configurado corretamente
- [ ] Deploy realizado (`fly deploy`)
- [ ] URL do backend anotada
- [ ] Secrets configurados (`fly secrets set`)
- [ ] Health check funcionando (`/api/auth/health`)
- [ ] Frontend atualizado com nova URL
- [ ] Login testado no frontend

---

## 🎉 Pronto!

Agora seu backend está rodando no Fly.io! 

**Vantagens:**
- ✅ Sempre ativo (não "dorme")
- ✅ Muito rápido
- ✅ Suporta Java nativamente
- ✅ Fácil de gerenciar via CLI

**Próximos deploys:**
Basta fazer `fly deploy` quando quiser atualizar o backend!

---

## 📚 Recursos Adicionais

- Documentação Fly.io: https://fly.io/docs
- Guia Java no Fly.io: https://fly.io/docs/languages-and-frameworks/java/
- Status do Fly.io: https://status.fly.io

