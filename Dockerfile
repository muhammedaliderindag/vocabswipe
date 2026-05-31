FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
# Prisma ve diğer derleme işlemleri için libc6-compat ve openssl ekliyoruz
RUN apk add --no-cache libc6-compat openssl
COPY package.json package-lock.json* ./
# package-lock.json henüz olmayabileceği için npm install kullanıyoruz
RUN npm install

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Prisma client'ı production için generate et
RUN npx prisma generate
# Next.js uygulamasını derle
RUN npm run build

FROM base AS runner
ENV NODE_ENV production
ENV PORT 3000

# Root olmayan kullanıcıyla çalıştırarak güvenliği artır
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Derlenmiş dosyaları kopyala
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Yetkili kullanıcıyı ayarla
USER nextjs

# Servisi iç ağa expose et (Port mapping değil, Docker içi dokümantasyon)
EXPOSE 3000

CMD ["npm", "run", "start"]
