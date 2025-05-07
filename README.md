# News Voyager

This project aims to develop a dynamic news website using a modern tech stack comprising React.js for frontend development and Express.js, Node.js, and MongoDB for the backend.

This project aims to offer users a engaging news consumption experience, with best of cloud-native practices!

## Utilities 

For accessing the `Argo CD` dasboard, simply run the command:

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

The username will be `admin` and in order to get the password, run the command:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

For accessing the `Argo Rollouts` dashboard, simply run the command:

```bash
kubectl argo rollouts dashboard
```

For accessing the `Grafana` dashboard, run the command:

```bash
kubectl port-forward svc/grafana 3000:80 -n monitoring
```