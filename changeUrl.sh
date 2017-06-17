#!/bin/bash
# elimino el deploy actual
ACTUAL="$(now ls | sed -n 5p | awk '{print $1;}')"
echo "ACTUAL"
echo "${ACTUAL}"
now rm ${ACTUAL} -y
# levanto un nuevo deploy
NUEVO=$(now --public)
echo "NUEVO"
echo "${NUEVO}"
# seteo el nuevo webhook
curl -F "url=${NUEVO}/new-message" https://api.telegram.org/bot420103356:AAHcOPrbMbpbwdGrYAdJ_hejYzJeciC3obg/setWebhook
