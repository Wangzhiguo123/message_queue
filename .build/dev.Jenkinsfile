node("product_development"){
    stage("clone code"){
         sh 'rm -rf /home/jenkins/workspace/dev-bdt-queuing-manager-ui/*'
         git branch: 'dev', credentialsId: 'dbe86224-f516-466c-a5e0-bd1b3c766fdb', url: 'http://git.cddpi.com/messagemiddleware/bdt-queuing-manager-ui.git'
    }

    stage('Build') {
        sh 'cnpm i'
    }
    stage('Package') {
        sh 'npm run build:prod'
    }

    stage('Deploy'){
        sh 'docker rmi -f docker.cddpi.com/bdt-queuing-manager-ui:dev'
        sh 'docker build -t docker.cddpi.com/bdt/bdt-queuing-manager-ui:dev .'
        sh 'docker login docker.cddpi.com -utczhang -pcddpi.c0m'
        sh 'docker push docker.cddpi.com/bdt/bdt-queuing-manager-ui:dev'
    }

    stage('Install') {
       sh "curl -k  \
           -X POST \
           -H 'Accept: application/json' \
           -H 'Content-Type: application/json' \
           -H 'Cookie: R_USERNAME=tczhang; CSRF=token-rfxx8; R_SESS=token-rfxx8:kskk45fqmgmf7shqxpw7vz8wfkh7r6kqj9x4qn6gvczglr8sgtdc7f' \
           https://192.168.0.51/v3/project/c-g7fjr:p-lqfzb/workloads/deployment:xjyt-dev:bdt-queuing-manager-ui?action=redeploy"
    }
}

