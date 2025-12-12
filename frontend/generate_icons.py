"""
Script para gerar ícones PWA e favicons com bordas arredondadas
Gera ícones PWA: 512x512, 192x192, 180x180
Gera favicons: 16x16, 32x32, 48x48, 64x64 (PNG) + favicon.ico (multipágina)
"""
from PIL import Image, ImageDraw
import os

def create_rounded_icon(input_path, output_path, size, radius_percent=20):
    """
    Cria um ícone com bordas arredondadas
    
    Args:
        input_path: Caminho da imagem original
        output_path: Caminho para salvar o ícone
        size: Tamanho do ícone (width, height)
        radius_percent: Porcentagem do raio de arredondamento (padrão 20%)
    """
    # Abrir imagem original
    img = Image.open(input_path)
    
    # Converter para RGBA se necessário
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Redimensionar mantendo proporção
    img.thumbnail((size, size), Image.Resampling.LANCZOS)
    
    # Criar nova imagem com fundo transparente
    output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    
    # Centralizar imagem redimensionada
    offset = ((size - img.width) // 2, (size - img.height) // 2)
    
    # Criar máscara com bordas arredondadas
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    
    # Calcular raio de arredondamento
    radius = int(size * radius_percent / 100)
    
    # Desenhar retângulo arredondado
    draw.rounded_rectangle([(0, 0), (size, size)], radius=radius, fill=255)
    
    # Aplicar a imagem com a máscara
    temp = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    temp.paste(img, offset)
    output.paste(temp, (0, 0), mask)
    
    # Salvar
    output.save(output_path, 'PNG', optimize=True)
    print(f'✓ Ícone criado: {output_path} ({size}x{size}px)')

def create_favicon_ico(input_path, output_path, sizes=[16, 24, 32, 48, 64]):
    """
    Cria um arquivo .ico multipágina com vários tamanhos
    
    Args:
        input_path: Caminho da imagem original
        output_path: Caminho para salvar o favicon.ico
        sizes: Lista de tamanhos a incluir no ICO
    """
    images = []
    
    for size in sizes:
        # Criar versão arredondada para cada tamanho
        img = Image.open(input_path)
        
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        img.thumbnail((size, size), Image.Resampling.LANCZOS)
        
        output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        offset = ((size - img.width) // 2, (size - img.height) // 2)
        
        mask = Image.new('L', (size, size), 0)
        draw = ImageDraw.Draw(mask)
        
        # Raio proporcional ao tamanho (15% para favicons menores)
        radius = max(2, int(size * 15 / 100))
        
        draw.rounded_rectangle([(0, 0), (size, size)], radius=radius, fill=255)
        
        temp = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        temp.paste(img, offset)
        output.paste(temp, (0, 0), mask)
        
        images.append(output)
    
    # Salvar como ICO multipágina
    images[0].save(output_path, format='ICO', sizes=[(img.width, img.height) for img in images])
    print(f'✓ Favicon ICO criado: {output_path} (tamanhos: {sizes})')

def main():
    # Caminhos
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_image = os.path.join(script_dir, 'Logo.jpg')
    icons_dir = os.path.join(script_dir, 'public', 'icons')
    public_dir = os.path.join(script_dir, 'public')
    
    # Criar diretório de saída se não existir
    os.makedirs(icons_dir, exist_ok=True)
    os.makedirs(public_dir, exist_ok=True)
    
    # Verificar se imagem original existe
    if not os.path.exists(input_image):
        print(f'❌ Erro: Arquivo não encontrado: {input_image}')
        return
    
    print(f'Gerando ícones PWA e favicons com bordas arredondadas...')
    print(f'Imagem original: {input_image}\n')
    
    # ========== Gerar ícones PWA ==========
    print('📱 Gerando ícones PWA...')
    pwa_sizes = [
        (512, 'icon-512.png'),
        (384, 'icon-384.png'),
        (256, 'icon-256.png'),
        (192, 'icon-192.png'),
        (180, 'icon-180.png')
    ]
    
    for size, filename in pwa_sizes:
        output_path = os.path.join(icons_dir, filename)
        create_rounded_icon(input_image, output_path, size)
    
    # ========== Gerar Favicons PNG ==========
    print('\n🔖 Gerando favicons PNG...')
    favicon_sizes = [
        (16, 'favicon-16.png'),
        (32, 'favicon-32.png'),
        (48, 'favicon-48.png'),
        (64, 'favicon-64.png')
    ]
    
    for size, filename in favicon_sizes:
        output_path = os.path.join(public_dir, filename)
        create_rounded_icon(input_image, output_path, size, radius_percent=15)
    
    # ========== Gerar Favicon ICO ==========
    print('\n📦 Gerando favicon.ico multipágina...')
    favicon_ico_path = os.path.join(public_dir, 'favicon.ico')
    create_favicon_ico(input_image, favicon_ico_path, [16, 24, 32, 48, 64])
    
    # ========== Gerar Apple Touch Icon ==========
    print('\n🍎 Gerando apple-touch-icon...')
    apple_icon_path = os.path.join(public_dir, 'apple-touch-icon.png')
    create_rounded_icon(input_image, apple_icon_path, 180, radius_percent=20)
    
    print(f'\n✅ Todos os ícones foram gerados com sucesso!')
    print(f'📁 Ícones PWA: {icons_dir}')
    print(f'📁 Favicons: {public_dir}')

if __name__ == '__main__':
    main()
