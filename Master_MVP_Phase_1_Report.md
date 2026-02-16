# Master MVP Phase 1 Report — Платформа AI-контенту та маркетингу

## 1. Загальна архітектура системи
Класична багаторівнева SaaS-система:
* **Frontend (Dashboard)**: Для Advisor, Compliance та Admin. Генерація контенту, редагування, approval workflow, email, кампанії, підписки.
* **Backend (API / Lambda)**: Бізнес-логіка, workflow, інтеграції з OpenAI, Facebook, LinkedIn, Stripe, SendGrid.
* **Database (PostgreSQL)**: Користувачі, контент, статуси, історія змін, API-ключі.
* **Background Jobs / Automation**: Постинг, email, реклама, messaging sequences через Lambda / Worker.
* **External Integrations**: OpenAI, Stripe, SendGrid, Facebook & LinkedIn APIs.
* **Storage (AWS S3)**: PDF/Word для approval та експорту.
* **Security & Secrets**: JWT або OAuth2, HTTPS, AWS Secrets Manager.

## 2. Детальний аналіз вимог та підводні камені

### a) AI Generated Content + FINRA/SEC rules
* **Backend**: Виклики LLM (OpenAI/Claude).
* **Frontend**: Форма для промптів та виведення контенту.
* **Підводні камені**:
  * Галюцинації LLM → Rules Engine, пост-обробка.
  * Audit trail → зберігати всі версії тексту, промпти та зміни комплаєнсу.
  * Prompt engineering → навчання/фільтрація контенту на схвалені приклади.

### b) Публікація у Facebook та LinkedIn
* **Frontend**: OAuth для акаунтів, вибір сторінок/профілів.
* **Backend**: Graph API та LinkedIn Marketing API.
* **Підводні камені**:
  * Складність API, різні вимоги для компаній vs. профілів.
  * Термін дії токенів → refresh token + фонові процеси.
  * App Review для Meta → може зайняти тижні.

### c) Підписка та Stripe
* **Frontend**: Pricing Page + Stripe Checkout.
* **Backend**: Webhook для checkout.session.completed.
* **Підводні камені**:
  * Надійність Webhook → ідемпотентність та retry.
  * Синхронізація статусів між Stripe і БД.

### d) LinkedIn Messaging Sequencing
* **Backend**: Job Queue для планування та відправки повідомлень.
* **Підводні камені**:
  * Ліміти LinkedIn, InMail коштує грошей.
  * Не можна обходити API через сторонні бібліотеки → ризик блокування акаунтів.

### e) Facebook Ad Creation
* **Backend**: Інтеграція з Facebook Marketing API для кампаній та лід-форм.
* **Підводні камені**:
  * Складність → Кампанія → Ad Set → Creative → Lead Form.
  * Модерація → статуси оголошень на фронтенді.

### f) Email-шаблони та послідовності (SendGrid)
* **Frontend**: Візуальний редактор шаблонів та налаштування послідовностей.
* **Backend**: Використання SendGrid API (dynamic_template_data).
* **Підводні камені**:
  * Репутація домену, доставка листів.
  * Управління відписками → законодавчі вимоги (GDPR/CCPA).

### g) Compliance Workflows
* **Frontend**: Список контенту для комплаєнсу, редагування, коментування, approve/return.
* **Backend**: Статуси (Draft, Pending, Needs Changes, Approved, Posted).
* **Database**: Зберігання всіх версій контенту + audit trail.
* **Підводні камені**:
  * Кнопка "Опублікувати" активна лише при статусі Approved.
  * Нотифікації → in-app, WebSocket, email.
  * PDF/Word для затвердження → Puppeteer, PDFKit.

## 3. Головні технічні ризики
1. Управління API-ключами та токенами → .env + зашифрована БД.
2. Webhook reliability → ідемпотентність + retry + черги завдань.
3. "Клієнт 0" → створити тестові акаунти та сторінки.
4. Складність FINRA/SEC compliance → почати з AI + workflow + БД.
5. API rate limits та модерація → використовувати лише офіційні API.

## 4. Frontend (Клієнтська частина)
* **Стек**: React + Next.js + TypeScript + Tailwind + React Query / RTK Query
* **Задачі**: Авторизація, відображення статусів контенту, форми генерації/редагування, approval workflow, email, кампанії, billing/Stripe Checkout
* **Плюси**: Dashboard-орієнтований, SSR/SPA, типізація, швидка верстка
* **Мінуси**: Складність SSR + API routes, необхідно володіти TypeScript

## 5. Backend (Серверна частина)
* **Стек**: Node.js + TypeScript + AWS Lambda + API Gateway + EventBridge + SQS
* **Модулі**: API Lambdas (користувачі, контент, workflow, кампанії, інтеграції, billing), Worker Lambdas (automation, email, posting, messaging)
* **Плюси**: Serverless, швидка інтеграція, event-driven, retry логіка
* **Мінуси**: Cold start, connection pooling для PostgreSQL, обмеження execution time Lambda

## 6. Database & Storage
* **PostgreSQL (RDS / Aurora Serverless)** → Users, Content, Approvals, Campaigns, Integrations, Jobs, ProcessedEvents
* **Storage**: S3 → PDF/Word для approval та експорту
* **Плюси**: SQL → чіткі зв’язки, audit trail, легка фільтрація
* **Мінуси**: Connection pooling + VPC для Lambda

## 7. Workflow контенту
**Стани**: Draft → Pending Approval → Needs Changes → Approved → Scheduled → Posted  
**Логіка**:
1. Advisor створює контент
2. Контент → Pending Approval
3. Compliance редагує / повертає / approve
4. Після approve → дозволено email, постинг, реклама  
**Підводні камені**: Backend перевіряє статус перед публікацією, всі версії зберігаються (audit trail)

## 8. Automation Architecture
* **Scheduler** → запуск задач за розкладом
* **Worker** → email, posting, messaging
* **Retry логіка** → exponential backoff
* **Idempotency** → уникнення повторних дій

## 9. Integrations Flow

| Сервіс | Використання | Ризики |
|--------|--------------|--------|
| OpenAI / LLM | AI-контент з FINRA/SEC правилами | Галюцинації → Rules Engine, пост-обробка |
| LinkedIn API | Постинг, messaging sequences | Ліміти API, блокування акаунтів |
| Facebook Graph API / Ads | Постинг та реклама | Складність Ads API, модерація, токени |
| Stripe | Billing, subscriptions | Webhook reliability, синхронізація статусів |
| SendGrid | Email templates & sequences | Доставка, unsubscribe, репутація домену |

## 10. Security & Secrets
* JWT / OAuth2, HTTPS
* AWS Secrets Manager → токени, ключі, паролі
* Access control по ролях (Advisor / Compliance / Admin)
* Audit log для FINRA/SEC

## 11. Рекомендований порядок розробки
1. **Phase 1** → Auth + Content CRUD + Approval Workflow
2. **Phase 2** → Email + Posting (FB перед LinkedIn)
3. **Phase 3** → Billing / Stripe
4. **Phase 4** → Ads + Messaging Automation

## 12. Вибір технологій

| Компонент | Технологія | Плюси | Мінуси |
|------------|------------|-------|--------|
| Frontend | React + Next.js + TypeScript + Tailwind | Dashboard-орієнтований, швидка верстка, типізація | Потрібен досвід TypeScript |
| Backend | Node.js + TypeScript + Lambda + EventBridge | Serverless, швидка інтеграція, автоматичне масштабування | Cold start, connection pooling |
| Database | PostgreSQL (RDS / Aurora) | Чіткі зв’язки, audit trail | Connection pooling, VPC |
| Storage | S3 | Масштабовано, легко інтегрувати | Управління правами доступу |
| Integrations | OpenAI, LinkedIn, FB, Stripe, SendGrid | Повний функціонал, SDK підтримка | Rate limits, токени, модерація |

## 13. Оцінка часу та ресурсів по модулях

| Компонент | Час (дні) | Примітки |
|-----------|-----------|----------|
| Frontend | 14–17 | Dashboard + Forms + Tables |
| Backend | 34–44 | API + Workflow + Automation |
| Database & Storage | 3–5 | Schema + PDF/S3 |
| Security & Logging | 5–6 | Auth, Secrets, Audit |
| Automation & Workers | 6–7 | Scheduler + Worker + Idempotency |
| **Загалом** | **62–79 днів** | (~3–4 місяці для одного full-stack без QA) |

70% часу піде на: API інтеграції (Facebook, LinkedIn, Stripe, SendGrid), AI-контент + compliance workflow, workflow та automation логіку

## 14. Висновок
* Стандартна SaaS-архітектура
* Основний ризик → інтеграції та compliance workflow
* Поетапна реалізація знижує складність
* Стек дозволяє масштабувати MVP у production без технічного боргу