```markdown
# Système d'Arrosage Automatisé

![Logo du Projet](link_to_logo)

## 📝 Description

Le projet d'amélioration du système d'arrosage vise à optimiser l'irrigation pour une pépinière gérée par un GIE (Groupement d'Intérêt Économique). Le système permet aux utilisateurs de contrôler et de programmer l'arrosage via une interface web, en utilisant des capteurs pour surveiller l'humidité du sol et la luminosité en temps réel. Les utilisateurs peuvent se connecter via une carte RFID ou un code, et les administrateurs peuvent gérer les utilisateurs et les paramètres d'arrosage. Le système utilise une carte Raspberry Pi avec des capteurs et des modules relais pour automatiser l'arrosage en fonction des besoins spécifiques des plantes. Le projet inclut également des fonctionnalités de performance, de sécurité, de déploiement, de maintenance, et de support pour assurer une utilisation efficace et durable.

## 🌱 Fonctionnalités

- Connexion via carte RFID ou code
- Contrôle de l'arrosage manuel et automatique
- Surveillance en temps réel de l'humidité du sol et de la luminosité
- Gestion des utilisateurs et des paramètres d'arrosage
- Interface web intuitive avec AngularJS
- Backend robuste avec Laravel et Node.js
- Utilisation de capteurs et de modules relais avec Raspberry Pi
- Fonctionnalités de performance, sécurité, déploiement, maintenance, et support

## 📦 Structure du Projet

```
monorepo/
├── frontend/ # Angular (Frontend)
├── backend-core/ # Laravel 11 (API Principale)
├── backend-iot/ # Node.js (IoT)
└── infrastructure/ # Docker, Kubernetes
```

## 🚀 Installation

### Prérequis

- Node.js et npm
- PHP et Composer
- Docker et Kubernetes (optionnel)

### Étapes d'Installation

1. **Cloner les dépôts :**

Laravel: Backend-core
    ```bash
    git clone https://github.com/ndiawar/kerelBackend-core.git
    ```
NodeJs: Backend-iot
    ```bash
    git clone https://github.com/ndiawar/kerelBackend-iot.git
    ```

Angular: Frontend
    ```bash
    git clone https://github.com/ndiawar/frontend.git
    ```

2. **Installer les dépendances :**

    - **Frontend (Angular)**

      ```bash
      cd frontend
      npm install
      ```

    - **Backend Core (Laravel)**

      ```bash
      cd backend-core
      composer install
      ```

    - **Backend IoT (Node.js)**

      ```bash
      cd backend-iot
      npm install
      ```

## 🔧 Configuration

### Frontend (Angular)

1. **Configurer les variables d'environnement :**

    Créez un fichier `.env` dans le répertoire `frontend` et ajoutez vos variables d'environnement.

2. **Démarrer le serveur de développement :**

    ```bash
    npm start
    ```

### Backend Core (Laravel)

1. **Configurer les variables d'environnement :**

    Copiez le fichier `.env.example` en `.env` et configurez vos variables d'environnement.

2. **Générer la clé de l'application :**

    ```bash
    php artisan key:generate
    ```

3. **Démarrer le serveur de développement :**

    ```bash
    php artisan serve
    ```

### Backend IoT (Node.js)

1. **Configurer les variables d'environnement :**

    Créez un fichier `.env` dans le répertoire `backend-iot` et ajoutez vos variables d'environnement.

2. **Démarrer le serveur de développement :**

    ```bash
    npm start
    ```

## 🏗️ Infrastructure

### Docker

1. **Construire les images Docker :**

    ```bash
    cd infrastructure
    docker-compose build
    ```

2. **Démarrer les conteneurs :**

    ```bash
    docker-compose up
    ```

## 📚 Documentation

- [Documentation Frontend](frontend/docs)
- [Documentation Backend Core](backend-core/docs)
- [Documentation Backend IoT](backend-iot/docs)
- [Documentation Infrastructure](infrastructure/docs)

## 🤝 Contribuer

Les contributions sont les bienvenues ! Veuillez suivre les [directives de contribution](CONTRIBUTING.md).

## 📜 Licence

Ce projet est sous licence [MIT](LICENSE).

## 👥 Contact

Pour toute question ou suggestion, veuillez contacter [dndiawar20@gmail.com](mailto:dndiawar20@gmail.com).
