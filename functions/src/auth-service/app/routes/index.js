const express = require('express');
const router = express.Router();
const { usersRepo } = require('../../../shared/inMemoryStore');
const { v4: uuidv4 } = require('uuid');

// Función para generar un token JWT simulado (en producción usar una librería como jsonwebtoken)
function generateToken(user) {
  // En un entorno real, esto debería ser un JWT firmado
  return `mock-jwt-${user.id}-${Date.now()}`;
}

// Middleware para validar token (simulado)
async function validateToken(req, res, next) {
  try {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Token no proporcionado' }
      });
    }
    
    // En un entorno real, verificaríamos el token JWT aquí
    const tokenParts = token.split('-');
    if (tokenParts[0] !== 'mock' || tokenParts[1] !== 'jwt') {
      return res.status(401).json({
        success: false,
        error: { message: 'Token no válido' }
      });
    }
    
    // Obtener el ID del usuario del token
    const userId = tokenParts[2];
    const user = await usersRepo.getById(userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Usuario no encontrado' }
      });
    }
    
    // Adjuntar el usuario a la solicitud para su uso posterior
    req.user = user;
    next();
  } catch (error) {
    console.error('Error al validar token:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error al validar la sesión' }
    });
  }
}

// Ruta base para probar
router.get('/', (req, res) => {
  res.send('Auth Service funcionando');
});

// Ruta para ping
router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// POST /login - Autenticación de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email y contraseña son requeridos' }
      });
    }
    
    // Buscar usuario por email
    const user = await usersRepo.findOne({ email });
    
    // Validar credenciales (en un entorno real, usaríamos bcrypt para comparar contraseñas hasheadas)
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        error: { message: 'Credenciales inválidas' }
      });
    }
    
    // Generar token
    const token = generateToken(user);
    
    // Actualizar última fecha de inicio de sesión
    await usersRepo.update(user.id, {
      lastLogin: new Date().toISOString()
    });
    
    // No devolver la contraseña en la respuesta
    const { password: _, ...userData } = user;
    
    res.json({
      success: true,
      token,
      user: userData
    });
  } catch (error) {
    console.error('Error en POST /login:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error al iniciar sesión' }
    });
  }
});

// POST /sign-up - Registro de nuevo usuario
router.post('/sign-up', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Nombre, email y contraseña son requeridos' }
      });
    }
    
    // Verificar si el email ya está registrado
    const existingUser = await usersRepo.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'El email ya está registrado' }
      });
    }
    
    // Crear nuevo usuario
    const newUser = await usersRepo.create({
      name,
      email,
      password, // En un entorno real, deberíamos hashear la contraseña
      role: 'user',
      status: 'active',
      create_date: new Date().toISOString(),
      update_date: new Date().toISOString(),
      lastLogin: null
    });
    
    // Generar token para el nuevo usuario
    const token = generateToken(newUser);
    
    // No devolver la contraseña en la respuesta
    const { password: _, ...userData } = newUser;
    
    res.status(201).json({
      success: true,
      token,
      user: userData,
      message: 'Usuario registrado exitosamente'
    });
  } catch (error) {
    console.error('Error en POST /sign-up:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error al registrar el usuario' }
    });
  }
});

// POST /logout - Cerrar sesión
router.post('/logout', validateToken, async (req, res) => {
  try {
    // En un entorno real, invalidaríamos el token aquí
    // Por ahora, simplemente respondemos con éxito
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    console.error('Error en POST /logout:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error al cerrar sesión' }
    });
  }
});

// GET /validate-session - Validar sesión activa
router.get('/validate-session', validateToken, (req, res) => {
  try {
    // Si el middleware validateToken pasó, el token es válido
    // y el usuario está disponible en req.user
    const { password, ...userData } = req.user;
    
    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Error en GET /validate-session:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error interno del servidor' }
    });
  }
});

// POST /reset-password-request - Solicitar reset de contraseña
router.post('/reset-password-request', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email es requerido' }
      });
    }
    
    // Buscar usuario por email
    const user = await usersRepo.findOne({ email });
    
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return res.json({
        success: true,
        message: 'Si el email existe, se ha enviado un enlace de recuperación'
      });
    }
    
    // Generar token de recuperación (en un entorno real, sería un token seguro con expiración)
    const resetToken = `reset-${uuidv4()}`;
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora de expiración
    
    // Guardar el token en el usuario
    await usersRepo.update(user.id, {
      resetToken,
      resetTokenExpires: resetTokenExpires.toISOString(),
      update_date: new Date().toISOString()
    });
    
    // En un entorno real, enviaríamos un email con un enlace que incluya el token
    console.log(`Token de recuperación para ${email}: ${resetToken}`);
    
    res.json({
      success: true,
      message: 'Si el email existe, se ha enviado un enlace de recuperación'
    });
  } catch (error) {
    console.error('Error en POST /reset-password-request:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error al procesar la solicitud de recuperación' }
    });
  }
});

// POST /reset-password - Confirmar nueva contraseña
router.post('/reset-password', async (req, res) => {
  try {
    const { new_password } = req.body;
    const resetToken = req.headers['x-reset-password-token'];
    
    if (!new_password || !resetToken) {
      return res.status(400).json({
        success: false,
        error: { message: 'Nueva contraseña y token son requeridos' }
      });
    }
    
    // Buscar usuario por token de recuperación
    const user = await usersRepo.findOne({ 
      resetToken,
      resetTokenExpires: { $gt: new Date().toISOString() } // Token no expirado
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: { message: 'Token de recuperación inválido o expirado' }
      });
    }
    
    // Actualizar contraseña y limpiar token
    await usersRepo.update(user.id, {
      password: new_password, // En un entorno real, deberíamos hashear la contraseña
      resetToken: null,
      resetTokenExpires: null,
      update_date: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente. Por favor inicia sesión con tu nueva contraseña.'
    });
  } catch (error) {
    console.error('Error en POST /reset-password:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error al restablecer la contraseña' }
    });
  }
});

// PUT /users/:id - Editar información de usuario
router.put('/users/:id', validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, currentPassword, newPassword } = req.body;
    
    // Verificar que el usuario solo pueda editar su propia información
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'No tienes permiso para editar este usuario' }
      });
    }
    
    // Validar datos requeridos
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: { message: 'Nombre y email son requeridos' }
      });
    }
    
    // Obtener el usuario actual
    const user = await usersRepo.getById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'Usuario no encontrado' }
      });
    }
    
    // Verificar si el email ya está en uso por otro usuario
    if (email !== user.email) {
      const existingUser = await usersRepo.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: { message: 'El email ya está en uso' }
        });
      }
    }
    
    // Preparar datos de actualización
    const updateData = {
      name,
      email,
      update_date: new Date().toISOString()
    };
    
    // Si se está intentando cambiar la contraseña
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          error: { message: 'La contraseña actual es requerida' }
        });
      }
      
      // Verificar contraseña actual (en un entorno real, comparar con hash)
      if (currentPassword !== user.password) {
        return res.status(400).json({
          success: false,
          error: { message: 'Contraseña actual incorrecta' }
        });
      }
      
      // Actualizar contraseña (en un entorno real, hashear la nueva contraseña)
      updateData.password = newPassword;
    }
    
    // Actualizar usuario
    const updatedUser = await usersRepo.update(id, updateData);
    
    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        error: { message: 'Error al actualizar el usuario' }
      });
    }
    
    // No devolver la contraseña en la respuesta
    const { password, ...userData } = updatedUser;
    
    res.json({
      success: true,
      data: userData,
      message: 'Usuario actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error en PUT /users/:id:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error al actualizar el usuario' }
    });
  }
});

module.exports = router;